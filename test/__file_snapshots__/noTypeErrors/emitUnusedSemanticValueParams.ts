import { TysonTypeDictionary } from "../../fixtures/shouldSucceed/emitUnusedSemanticValueParams/typeDict";

declare var yytext: string;

const semanticActions = {
  "expressions -> e EOF"(
    $1: TysonTypeDictionary["e"],
    $2: TysonTypeDictionary["EOF"]
  ): TysonTypeDictionary["expressions"] {
    let $$: TysonTypeDictionary["expressions"];
    return $1;
  },

  "e -> e + e"(
    $1: TysonTypeDictionary["e"],
    $2: TysonTypeDictionary["+"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 + $3;
    return $$;
  },

  "e -> e - e"(
    $1: TysonTypeDictionary["e"],
    $2: TysonTypeDictionary["-"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 - $3;
    return $$;
  },

  "e -> e * e"(
    $1: TysonTypeDictionary["e"],
    $2: TysonTypeDictionary["*"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 * $3;
    return $$;
  },

  "e -> e / e"(
    $1: TysonTypeDictionary["e"],
    $2: TysonTypeDictionary["/"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $1 / $3;
    return $$;
  },

  "e -> e ^ e"(
    $1: TysonTypeDictionary["e"],
    $2: TysonTypeDictionary["^"],
    $3: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Math.pow($1, $3);
    return $$;
  },

  "e -> - e"(
    $1: TysonTypeDictionary["-"],
    $2: TysonTypeDictionary["e"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = -$2;
    return $$;
  },

  "e -> ( e )"(
    $1: TysonTypeDictionary["("],
    $2: TysonTypeDictionary["e"],
    $3: TysonTypeDictionary[")"]
  ): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = $2;
    return $$;
  },

  "e -> NUMBER"($1: TysonTypeDictionary["NUMBER"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Number(yytext);
    return $$;
  },

  "e -> E"($1: TysonTypeDictionary["E"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Math.E;
    return $$;
  },

  "e -> PI"($1: TysonTypeDictionary["PI"]): TysonTypeDictionary["e"] {
    let $$: TysonTypeDictionary["e"];
    $$ = Math.PI;
    return $$;
  },
};
