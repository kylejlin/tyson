# Node API Docs

## Installation

```sh
npm install --save tyson
```

## Usage

```ts
import { generateTypeScriptFile, TysonConfig } from "tyson";

const config: TysonConfig = {
    pathToBnfGrammarFile: /* ... */,
    pathToTypeDictFile: /* ... */,
    pathToOutputFile: /* ... */,
    typeDictInterfaceName: /* ... */,
    emitUnusedLocations: /* ... */,
    emitUnusedSemanticValueParams: /* ... */,
};

generateTypeScriptFile(config);
```

### Config properties

| Property                                   | Type      | Description                                                                                                                                                                                                                                                                                                      | Example value                                                      |
| ------------------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `pathToBnfGrammarFile`                     | `string`  | A path to the `.jison` file you want Tyson to use.                                                                                                                                                                                                                                                               | `path.join(__dirname, "../grammar/myAwesomeGrammar.jison")`        |
| `pathToTypeDictFile`                       | `string`  | A path to a TypeScript file exporting the type dictionary interface you want Tyson to use. For more info on type dictionaries, please refer to [`Concepts`](./concepts.md#type-dictionaries).                                                                                                                    | `path.join(__dirname, "./typeDict.ts")`                            |
| `pathToOutputFile`                         | `string`  | A path pointing to where you want Tyson to emit the generated TypeScript file. The file does not need to already exist, but the containing directory does (e.g., if you want to pass `./src/generated/semanticActions.generated.ts`, then the directory `./src/generated/` must exist prior to running `tyson`). | `path.join(__dirname, "./generated/semanticActions.generated.ts")` |
| `typeDictInterfaceName` (optional)         | `string`  | The name of the type dictionary interface the generated file should import from your type dictionary file. If this argument is not explicitly specified, it will default to `"TysonTypeDictionary"`.                                                                                                             | `"YourTysonTypeDict"`                                              |
| `emitUnusedLocations` (optional)           | `boolean` | If this is set to `true`, `yylstack` will have a location field for each symbol in the production RHS, regardless of whether that symbol's location is used by the semantic action or not. If this argument is not explicitly specified, it will default to `false`.                                             | `true`                                                             |
| `emitUnusedSemanticValueParams` (optional) | `boolean` | If this is set to `true`, a semantic value parameter will be emitted for each symbol in a production's RHS, regardless of whether the semantic action uses it or not. If this argument is not explicitly specified, it will default to `false`.                                                                  | `true`                                                             |
