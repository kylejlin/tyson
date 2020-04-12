export interface TysonTypeDictionary {
  expressions: Node;
  EOF: unknown;
  e: Node;
  "+": string;
  "-": string;
  "*": string;
  "/": string;
  "^": string;
  "(": string;
  ")": string;
  NUMBER: string;
  E: string;
  PI: string;
}

export type Node = BinaryOperationNode | UnaryOperationNode | NumberNode;

export interface BinaryOperationNode {
  nodeType: "BinaryOperation";

  operation: "+" | "-" | "*" | "/" | "^";
  left: Node;
  right: Node;

  location: TokenLocation;
}

export interface UnaryOperationNode {
  nodeType: "UnaryOperation";

  operation: "-";
  right: Node;

  location: TokenLocation;
}

export interface NumberNode {
  nodeType: "Number";

  value: number;

  location: TokenLocation;
}

export interface TokenLocation {
  first_line: number;
  first_column: number;
  last_line: number;
  last_column: number;
}
