import { TysonTypeDictionary } from "../../fixtures/shouldSucceed/usesModuleInclude/typeDict";

function createNodeWithDepth(depth: number): number {
  return depth;
}

const semanticActions = {
  "start -> optParens EOF"(
    $1: TysonTypeDictionary["optParens"]
  ): TysonTypeDictionary["start"] {
    let $$: TysonTypeDictionary["start"];
    return $1;
  },

  "optParens -> "(): TysonTypeDictionary["optParens"] {
    let $$: TysonTypeDictionary["optParens"];
    $$ = createNodeWithDepth(0);
    return $$;
  },

  "optParens -> ( optParens )"(
    $2: TysonTypeDictionary["optParens"]
  ): TysonTypeDictionary["optParens"] {
    let $$: TysonTypeDictionary["optParens"];
    $$ = createNodeWithDepth(1 + $2);
    return $$;
  },
};
