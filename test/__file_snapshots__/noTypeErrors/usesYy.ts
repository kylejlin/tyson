import {
  TysonTypeDictionary,
  yy,
} from "../../fixtures/shouldSucceed/usesYy/typeDict";

const semanticActions = {
  "start -> optParens EOF"(
    $1: TysonTypeDictionary["optParens"]
  ): TysonTypeDictionary["start"] {
    let $$: TysonTypeDictionary["start"];
    return $1;
  },

  "optParens -> "(): TysonTypeDictionary["optParens"] {
    let $$: TysonTypeDictionary["optParens"];
    $$ = yy.createNodeWithDepth(0);
    return $$;
  },

  "optParens -> ( optParens )"(
    $2: TysonTypeDictionary["optParens"]
  ): TysonTypeDictionary["optParens"] {
    let $$: TysonTypeDictionary["optParens"];
    $$ = yy.createNodeWithDepth($2.depth + 1);
    return $$;
  },
};
