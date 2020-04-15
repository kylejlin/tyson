import { TysonTypeDictionary } from "../../fixtures/shouldFail/locationOutOfBounds/typeDict";

declare var yytext: string;

interface TokenLocation {
  first_line: number;
  last_line: number;
  first_column: number;
  last_column: number;
  range: [number, number];
}

const semanticActions = {
  "expressions -> e EOF"(
    $1: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["expressions"] {
    let $$: TysonTypeDictionary["expressions"];
    return $1;
  },

  "e -> e + e"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "BinaryOperation",
      operation: "+",
      left: $1,
      right: $3,
      location: yylstack["@$"],
    };
    return $$;
  },

  "e -> e - e"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "BinaryOperation",
      operation: "-",
      left: $1,
      right: $3,
      location: yylstack["@$"],
    };
    return $$;
  },

  "e -> e * e"(
    yylstack: { "@1": TokenLocation; "@3": TokenLocation },

    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "BinaryOperation",
      operation: "*",
      left: $1,
      right: $3,
      location: {
        first_line: yylstack["@1"].first_line,
        first_column: yylstack["@1"].first_column,
        last_line: yylstack["@3"].last_line,
        last_column: yylstack["@4"].last_column,
      },
    };
    return $$;
  },

  "e -> e / e"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "BinaryOperation",
      operation: "/",
      left: $1,
      right: $3,
      location: yylstack["@$"],
    };
    return $$;
  },

  "e -> e ^ e"(
    yylstack: { "@$": TokenLocation },

    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "BinaryOperation",
      operation: "^",
      left: $1,
      right: $3,
      location: yylstack["@$"],
    };
    return $$;
  },

  "e -> - e"(
    yylstack: { "@$": TokenLocation },

    $2: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "UnaryOperation",
      operation: "-",
      right: $2,
      location: yylstack["@$"],
    };
    return $$;
  },

  "e -> ( e )"($2: TysonTypeDictionary["e"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $2;
    return $$;
  },

  "e -> NUMBER"(yylstack: { "@$": TokenLocation }): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = {
      nodeType: "Number",
      value: Number(yytext),
      location: yylstack["@$"],
    };
    return $$;
  },

  "e -> E"(yylstack: { "@$": TokenLocation }): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "Number", value: Math.E, location: yylstack["@$"] };
    return $$;
  },

  "e -> PI"(yylstack: { "@$": TokenLocation }): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "Number", value: Math.PI, location: yylstack["@$"] };
    return $$;
  },
};
