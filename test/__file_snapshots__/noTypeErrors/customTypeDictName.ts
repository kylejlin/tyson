import { MyCustomTysonTypeDict } from "../../fixtures/shouldSucceed/customTypeDictName/typeDict";

declare var yytext: string;

const semanticActions = {
  "expressions -> e EOF"(
    $1: MyCustomTysonTypeDict["e"]
  ): MyCustomTysonTypeDict["expressions"] {
    let $$: MyCustomTysonTypeDict["expressions"];
    return $1;
  },

  "e -> e + e"(
    $1: MyCustomTysonTypeDict["e"],
    $3: MyCustomTysonTypeDict["e"]
  ): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = $1 + $3;
    return $$;
  },

  "e -> e - e"(
    $1: MyCustomTysonTypeDict["e"],
    $3: MyCustomTysonTypeDict["e"]
  ): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = $1 - $3;
    return $$;
  },

  "e -> e * e"(
    $1: MyCustomTysonTypeDict["e"],
    $3: MyCustomTysonTypeDict["e"]
  ): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = $1 * $3;
    return $$;
  },

  "e -> e / e"(
    $1: MyCustomTysonTypeDict["e"],
    $3: MyCustomTysonTypeDict["e"]
  ): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = $1 / $3;
    return $$;
  },

  "e -> e ^ e"(
    $1: MyCustomTysonTypeDict["e"],
    $3: MyCustomTysonTypeDict["e"]
  ): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = Math.pow($1, $3);
    return $$;
  },

  "e -> - e"($2: MyCustomTysonTypeDict["e"]): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = -$2;
    return $$;
  },

  "e -> ( e )"($2: MyCustomTysonTypeDict["e"]): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = $2;
    return $$;
  },

  "e -> NUMBER"(): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = Number(yytext);
    return $$;
  },

  "e -> E"(): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = Math.E;
    return $$;
  },

  "e -> PI"(): MyCustomTysonTypeDict["e"] {
    let $$: MyCustomTysonTypeDict["e"];
    $$ = Math.PI;
    return $$;
  },
};
