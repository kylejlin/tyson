import { TysonTypeDictionary } from "../../fixtures/shouldSucceed/calculatorAst/typeDict";

declare var yytext: string;

const semanticActions = {
  "expressions -> e EOF"(
    $1: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["expressions"] {
    let $$: TysonTypeDictionary["expressions"];
    return $1;
  },

  "e -> e + e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "BinaryOperation", operation: "+", left: $1, right: $3 };
    return $$;
  },

  "e -> e - e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "BinaryOperation", operation: "-", left: $1, right: $3 };
    return $$;
  },

  "e -> e * e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "BinaryOperation", operation: "*", left: $1, right: $3 };
    return $$;
  },

  "e -> e / e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "BinaryOperation", operation: "/", left: $1, right: $3 };
    return $$;
  },

  "e -> e ^ e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "BinaryOperation", operation: "^", left: $1, right: $3 };
    return $$;
  },

  "e -> - e"($2: TysonTypeDictionary["e"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "UnaryOperation", operation: "-", right: $2 };
    return $$;
  },

  "e -> ( e )"($2: TysonTypeDictionary["e"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $2;
    return $$;
  },

  "e -> NUMBER"(): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "Number", value: Number(yytext) };
    return $$;
  },

  "e -> E"(): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "Number", value: Math.E };
    return $$;
  },

  "e -> PI"(): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = { nodeType: "Number", value: Math.PI };
    return $$;
  },
};
