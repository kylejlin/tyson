import { TysonTypeDictionary } from "../../fixtures/shouldSucceed/calculatorSimple/typeDict";

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
    $$ = $1 + $3;
    return $$;
  },

  "e -> e - e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 - $3;
    return $$;
  },

  "e -> e * e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 * $3;
    return $$;
  },

  "e -> e / e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 / $3;
    return $$;
  },

  "e -> e ^ e"(
    $1: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Math.pow($1, $3);
    return $$;
  },

  "e -> - e"($2: TysonTypeDictionary["e"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = -$2;
    return $$;
  },

  "e -> ( e )"($2: TysonTypeDictionary["e"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $2;
    return $$;
  },

  "e -> NUMBER"(): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Number(yytext);
    return $$;
  },

  "e -> E"(): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Math.E;
    return $$;
  },

  "e -> PI"(): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Math.PI;
    return $$;
  },
};
