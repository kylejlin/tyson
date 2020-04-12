import fs from "fs";
import path from "path";
import prettier from "prettier";
import bnfParser, { ParsedBnfGrammar } from "./lib/bnf-parser";

export interface TysonConfig {
  pathToBnfGrammarFile: string;
  pathToTypeDictFile: string;
  pathToOutputFile: string;
  typeDictInterfaceName?: string;
}

const DEFAULT_TYPE_DICT_INTERFACE_NAME = "TysonTypeDictionary";

export function generateTypeScriptFile(config: TysonConfig): void {
  const { pathToBnfGrammarFile, pathToOutputFile } = config;
  const grammarSource = fs.readFileSync(pathToBnfGrammarFile, "utf8");
  const parsedGrammar = bnfParser.parse(grammarSource);

  const generatedCode = generateCode(config, parsedGrammar);

  const prettierConfig =
    prettier.resolveConfig.sync(config.pathToOutputFile) || {};

  fs.writeFileSync(
    pathToOutputFile,
    prettier.format(generatedCode, {
      ...prettierConfig,
      parser: "typescript",
    })
  );
}

function generateCode(config: TysonConfig, grammar: ParsedBnfGrammar): string {
  const { start } = grammar;

  if (start === undefined) {
    throw new Error(
      "The grammar defined in " +
        config.pathToBnfGrammarFile +
        " does not have a start symbol declared. Please declare one using `%start <symbolName>`."
    );
  }

  const dependencies = getActionDependencies(grammar);

  const importStatement = generateImportStatementCode(config, dependencies);
  const yyDeclarations = generateYyDeclarations(dependencies);
  const locationInterfaceDeclaration = generateTokenLocationInterfaceDeclarationIfNeeded(
    dependencies
  );
  const semanticActions = generateSemanticActionCode(
    {
      ...grammar,
      start,
    },
    getTypeDictInterfaceName(config)
  );

  return (
    importStatement +
    "\n\n" +
    yyDeclarations +
    "\n\n" +
    locationInterfaceDeclaration +
    "\n\n" +
    semanticActions
  );
}

function generateImportStatementCode(
  config: TysonConfig,
  dependencies: ActionDependencies
): string {
  const relativePath = path.relative(
    path.dirname(config.pathToOutputFile),
    config.pathToTypeDictFile
  );
  const withoutExtension = relativePath.replace(/(?:\.d)?\.ts/, "");
  const withLeadingDotSlash =
    withoutExtension.charAt(0) === "."
      ? withoutExtension
      : "." + path.sep + withoutExtension;

  return (
    "import { " +
    (dependencies.yy ? "yy, " : "") +
    getTypeDictInterfaceName(config) +
    " } from " +
    JSON.stringify(withLeadingDotSlash) +
    ";"
  );
}

function getTypeDictInterfaceName(config: TysonConfig): string {
  if (config.typeDictInterfaceName === undefined) {
    return DEFAULT_TYPE_DICT_INTERFACE_NAME;
  }

  return config.typeDictInterfaceName;
}

function generateYyDeclarations(dependencies: ActionDependencies): string {
  const yytext = dependencies.yytext ? "declare var yytext: string;" : "";
  const yyleng = dependencies.yyleng ? "declare var yyleng: string;" : "";
  const yylineno = dependencies.yylineno ? "declare var yylineno: string;" : "";
  return yytext + yyleng + yylineno;
}

function getActionDependencies(grammar: ParsedBnfGrammar): ActionDependencies {
  let tokenLocation = false;
  let yy = false;
  let yytext = false;
  let yyleng = false;
  let yylineno = false;

  Object.values(grammar.bnf).forEach((ruleActionPairs) =>
    ruleActionPairs.map(normalizeRuleActionPair).forEach(({ action }) => {
      if (/@(?:\$|-?\d+\b)/.test(action)) {
        tokenLocation = true;
      }

      if (/\byy\b/.test(action)) {
        yy = true;
      }

      if (/\byytext\b/.test(action)) {
        yytext = true;
      }

      if (/\byyleng\b/.test(action)) {
        yyleng = true;
      }

      if (/\byylineno\b/.test(action)) {
        yylineno = true;
      }
    })
  );

  return { tokenLocation, yy, yytext, yyleng, yylineno };
}

interface ActionDependencies {
  tokenLocation: boolean;
  yy: boolean;
  yytext: boolean;
  yyleng: boolean;
  yylineno: boolean;
}

function generateTokenLocationInterfaceDeclarationIfNeeded(
  dependencies: ActionDependencies
): string {
  return dependencies.tokenLocation
    ? "interface TokenLocation { first_line: number; last_line: number; first_column: number; last_column: number; range: [number, number]; }"
    : "";
}

interface ParsedBnfGrammarWithStartSymbol extends ParsedBnfGrammar {
  start: string;
}

function generateSemanticActionCode(
  grammar: ParsedBnfGrammarWithStartSymbol,
  typeDictInterfaceName: string
): string {
  const { start: startSymbol, bnf } = grammar;

  let code = "const semanticActions = {";

  Object.entries(bnf).forEach(([symbolName, ruleActionPairs]) => {
    ruleActionPairs.forEach((ruleActionPair) => {
      const { rule, action } = normalizeRuleActionPair(ruleActionPair);
      const methodDeclaration =
        JSON.stringify(symbolName + " -> " + rule) +
        getParenthesizedArgs(rule, action, typeDictInterfaceName) +
        getReturnAnnotation(symbolName, typeDictInterfaceName) +
        "{" +
        get$$Declaration(symbolName, typeDictInterfaceName) +
        action.replace(/@(\$|-?\d+\b)/g, 'yylstack["@$1"]') +
        (symbolName === startSymbol ? "}," : "\nreturn $$;},");
      code += methodDeclaration + "\n\n";
    });
  });

  code += "};";

  return code;
}

function normalizeRuleActionPair(
  ruleActionPair:
    | string
    | [string, string]
    | [string, { prec: string }]
    | [string, string, { prec: string }]
): { rule: string; action: string } {
  if (typeof ruleActionPair === "string") {
    return { rule: ruleActionPair, action: "$$ = $1;" };
  } else if ("object" === typeof ruleActionPair[1]) {
    return { rule: ruleActionPair[0], action: "$$ = $1;" };
  } else {
    return { rule: ruleActionPair[0], action: ruleActionPair[1] };
  }
}

function getParenthesizedArgs(
  rule: string,
  action: string,
  typeDictInterfaceName: string
): string {
  const actionReferencesTokenLocation = /@(\$|-?\d+\b)/g.test(action);
  const possibleYylstackArgDefWithComma = actionReferencesTokenLocation
    ? "yylstack: " + getYylstackType(rule) + ",\n\n"
    : "";
  return (
    "(" +
    possibleYylstackArgDefWithComma +
    rule
      .split(/\s+/g)
      .map(
        (arg, i) =>
          "$" +
          (i + 1) +
          ": " +
          typeDictInterfaceName +
          "[" +
          JSON.stringify(arg) +
          "]"
      )
      .join(", ") +
    ")"
  );
}

function getYylstackType(rule: string): string {
  return (
    "{" +
    ["@$"]
      .concat(rule.split(/\s+/g).map((_arg, i) => "@" + (i + 1)))
      .map((key) => JSON.stringify(key) + ": TokenLocation")
      .join(", ") +
    "}"
  );
}

function getReturnAnnotation(
  symbolName: string,
  typeDictInterfaceName: string
): string {
  return ": " + typeDictInterfaceName + "[" + JSON.stringify(symbolName) + "]";
}

function get$$Declaration(
  symbolName: string,
  typeDictInterfaceName: string
): string {
  return (
    "let $$: " + typeDictInterfaceName + "[" + JSON.stringify(symbolName) + "];"
  );
}
