export interface BnfParser {
  parse(bnfGrammar: string): ParsedBnfGrammar;
}

export interface ParsedBnfGrammar {

  moduleInclude?: string;

  lex?: {
    rules: [string, string][];
  };

  operators?: [AssociativityType, ...string[]][];

  start?: string;

  bnf: {
    [nonterminalName: string]: (
      | ProductionRule
      | [ProductionRule, SemanticAction]
      | [ProductionRule, { prec: string }]
      | [ProductionRule, SemanticAction, { prec: string }]
    )[];
  };
}

export type AssociativityType = "left" | "right" | "nonassoc";

export type ProductionRule = string;
export type SemanticAction = string;

declare const bnfParser: BnfParser;

export default bnfParser;
