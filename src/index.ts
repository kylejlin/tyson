import fs from "fs";
import path from "path";
import prettier from "prettier";
import bnfParser, { ParsedBnfGrammar } from "./lib/bnf-parser";

export interface TysonConfig {
  /**
   * A path to the .jison file you want Tyson to use.
   */
  pathToBnfGrammarFile: string;

  /**
   * A path to a TypeScript file exporting the type dictionary interface you want Tyson to use.
   */
  pathToTypeDictFile: string;

  /**
   * A path pointing to where you want Tyson to emit the generated TypeScript file.
   *
   * The file does not need to already exist, but the containing directory does
   * (e.g., if you want to pass ./src/generated/semanticActions.generated.ts,
   * then the directory ./src/generated/ must exist prior to running tyson).
   */
  pathToOutputFile: string;

  /**
   * The name of the type dictionary interface the generated file
   * should import from your type dictionary file.
   *
   * If this field is omitted, it will default to `"TysonTypeDictionary"`.
   *
   * @default "TysonTypeDictionary"
   */
  typeDictInterfaceName?: string;

  /**
   * If this is set to `true`, `yylstack` will have a location field for
   * each symbol in the production RHS, regardless of whether that symbol's
   * location is used by the semantic action or not.
   *
   * @default false
   */
  emitUnusedLocations?: boolean;

  /**
   * If this is set to `true`, a semantic value parameter will be emitted
   * for each symbol in a production's RHS, regardless of whether the
   * semantic action uses it or not.
   *
   * @default false
   */
  emitUnusedSemanticValueParams?: boolean;
}

interface CompleteTysonConfig extends TysonConfig {
  typeDictInterfaceName: string;
  emitUnusedLocations: boolean;
  emitUnusedSemanticValueParams: boolean;
}

const DEFAULTS = {
  typeDictInterfaceName: "TysonTypeDictionary",
  emitUnusedLocations: false,
  emitUnusedSemanticValueParams: false,
};

export function generateTypeScriptFile(config: TysonConfig): void {
  const completeConfig = applyDefaultsAsNeeded(config);

  const { pathToBnfGrammarFile, pathToOutputFile } = completeConfig;
  const grammarSource = fs.readFileSync(pathToBnfGrammarFile, "utf8");
  const parsedGrammar = bnfParser.parse(grammarSource);

  const generatedCode = generateCode(completeConfig, parsedGrammar);

  const prettierConfig =
    prettier.resolveConfig.sync(completeConfig.pathToOutputFile) || {};

  fs.writeFileSync(
    pathToOutputFile,
    prettier.format(generatedCode, {
      ...prettierConfig,
      parser: "typescript",
    })
  );
}

function applyDefaultsAsNeeded(config: TysonConfig): CompleteTysonConfig {
  const typeDictInterfaceName =
    config.typeDictInterfaceName !== undefined
      ? config.typeDictInterfaceName
      : DEFAULTS.typeDictInterfaceName;
  const emitUnusedLocations =
    config.emitUnusedLocations !== undefined
      ? config.emitUnusedLocations
      : DEFAULTS.emitUnusedLocations;
  const emitUnusedSemanticValueParams =
    config.emitUnusedSemanticValueParams !== undefined
      ? config.emitUnusedSemanticValueParams
      : DEFAULTS.emitUnusedSemanticValueParams;

  return {
    ...config,
    typeDictInterfaceName,
    emitUnusedLocations,
    emitUnusedSemanticValueParams,
  };
}

function generateCode(
  config: CompleteTysonConfig,
  grammar: ParsedBnfGrammar
): string {
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
    config
  );

  return (
    importStatement +
    "\n\n" +
    yyDeclarations +
    "\n\n" +
    (grammar.moduleInclude || '') +
    "\n\n" +
    locationInterfaceDeclaration +
    "\n\n" +
    semanticActions
  );
}

function generateImportStatementCode(
  config: CompleteTysonConfig,
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
    config.typeDictInterfaceName +
    (dependencies.yy ? ", yy" : "") +
    " } from " +
    JSON.stringify(withLeadingDotSlash) +
    ";"
  );
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
  config: CompleteTysonConfig
): string {
  const { start: startSymbol, bnf } = grammar;

  let code = "const semanticActions = {";

  Object.entries(bnf).forEach(([symbolName, ruleActionPairs]) => {
    ruleActionPairs.forEach((ruleActionPair) => {
      const { rule, action } = normalizeRuleActionPair(ruleActionPair);
      const methodDeclaration =
        JSON.stringify(symbolName + " -> " + rule) +
        generateParenthesizedParamDefs(rule, action, config) +
        generateReturnAnnotation(symbolName, config.typeDictInterfaceName) +
        "{" +
        generate$$Declaration(symbolName, config.typeDictInterfaceName) +
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

function generateParenthesizedParamDefs(
  rhs: string,
  action: string,
  config: CompleteTysonConfig
): string {
  const possibleYylstackParamDef = generateYylstackParamDefIfNeeded(
    rhs,
    action,
    config
  );
  const possibleYylstackArgDefWithCommaAndNewlinesIfNeeded =
    possibleYylstackParamDef === "" ? "" : possibleYylstackParamDef + ",\n\n";

  const semanticValueParamDefs = generateSemanticValueParamDefs(
    rhs,
    action,
    config
  );

  return (
    "(" +
    possibleYylstackArgDefWithCommaAndNewlinesIfNeeded +
    semanticValueParamDefs +
    ")"
  );
}

function generateYylstackParamDefIfNeeded(
  rhs: string,
  action: string,
  config: CompleteTysonConfig
): string {
  const referencedLocations = action.match(/@(\$|-?\d+\b)/g);

  if (referencedLocations === null) {
    return "";
  } else {
    return (
      "yylstack: " + generateYylstackType(rhs, referencedLocations, config)
    );
  }
}

function generateYylstackType(
  rule: string,
  referencedLocations: string[],
  config: CompleteTysonConfig
): string {
  const allLocations = ["@$"].concat(
    rule
      .split(/\s+/g)
      .filter((symbol) => symbol != "")
      .map((_arg, i) => "@" + (i + 1))
  );
  const emittedLocations = config.emitUnusedLocations
    ? allLocations
    : allLocations.filter((location) => referencedLocations.includes(location));
  return (
    "{" +
    emittedLocations.map((key) => '"' + key + '": TokenLocation').join(", ") +
    "}"
  );
}

function generateSemanticValueParamDefs(
  rhs: string,
  action: string,
  config: CompleteTysonConfig
): string {
  const namesOfReferencedSemanticValueParams = action.match(/\$\d+\b/g) || [];
  const allParams = rhs
    .split(/\s+/g)
    .filter((symbol) => symbol != "")
    .map((symbol, i) => {
      return {
        name: "$" + (i + 1),
        type: config.typeDictInterfaceName + "[" + JSON.stringify(symbol) + "]",
      };
    });
  const emittedParams = config.emitUnusedSemanticValueParams
    ? allParams
    : allParams.filter((param) =>
        namesOfReferencedSemanticValueParams.includes(param.name)
      );
  return emittedParams
    .map((param) => param.name + ": " + param.type)
    .join(", ");
}

function generateReturnAnnotation(
  symbolName: string,
  typeDictInterfaceName: string
): string {
  return ": " + typeDictInterfaceName + "[" + JSON.stringify(symbolName) + "]";
}

function generate$$Declaration(
  lefthandSymbol: string,
  typeDictInterfaceName: string
): string {
  return (
    "let $$: " +
    typeDictInterfaceName +
    "[" +
    JSON.stringify(lefthandSymbol) +
    "];"
  );
}
