export interface TysonTypeDictionary {
  "(": string;
  ")": string;
  EOF: "";
  INVALID: string;

  start: Node;
  optParens: Node;
}

interface Node {
  depth: number;
}

export declare const yy: Yy;

interface Yy {
  createNodeWithDepth(n: number): Node;
}
