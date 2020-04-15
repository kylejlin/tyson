export interface TysonTypeDictionary {
  "(": string;
  ")": string;
  EOF: "";
  INVALID: string;

  start: number;
  optParens: number;
}
