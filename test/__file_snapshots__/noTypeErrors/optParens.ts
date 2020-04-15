import { TysonTypeDictionary } from "../../fixtures/shouldSucceed/optParens/typeDict";

const semanticActions = {
  "start -> optParens EOF"(
    $1: TysonTypeDictionary["optParens"]
  ): TysonTypeDictionary["start"] {
    let $$: TysonTypeDictionary["start"];
    return $1;
  },

  "optParens -> "(): TysonTypeDictionary["optParens"] {
    let $$: TysonTypeDictionary["optParens"];
    $$ = 0;
    return $$;
  },

  "optParens -> ( optParens )"(
    $2: TysonTypeDictionary["optParens"]
  ): TysonTypeDictionary["optParens"] {
    let $$: TysonTypeDictionary["optParens"];
    $$ = 1 + $2;
    return $$;
  },
};
