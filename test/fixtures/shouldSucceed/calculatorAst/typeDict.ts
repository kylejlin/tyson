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
}

export interface UnaryOperationNode {
  nodeType: "UnaryOperation";

  operation: "-";
  right: Node;
}

export interface NumberNode {
  nodeType: "Number";

  value: number;
}
