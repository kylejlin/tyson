# CLI Docs

## Installation

You have three choices:

1. Use in package.json script (RECOMMENDED):

   ```sh
   npm install --save-dev tyson
   ```

   `package.json`:

   ```json
   {
     "scripts": {
       "tyson": "tyson ./myGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts"
     }
   }
   ```

2. Use npx:

   ```sh
   npx tyson -- ./myGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts
   ```

3. Install globally:

   ```sh
   npm install -g tyson

   tyson ./myGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts
   ```

## Usage

```sh
tyson <grammar-file> <type-dict-file> --out <output-file> [--type-dict-interface <type-dict-interface>] [--emit-unused-locations] [--emit-unused-semantic-value-params]
```

### Flags and arguments

| Flag                                                                           | Argument                           | Description                                                                                                                                                                                                                                                                                                      | Example value                                  |
| ------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| None required (but you can optionally use `--in` if you find it more readable) | `<grammar-file>`                   | A path to the `.jison` file you want Tyson to use.                                                                                                                                                                                                                                                               | `./grammar/myAwesomeGrammar.jison`             |
| None required (but you can optionally use `--in` if you find it more readable) | `<type-dict-file>`                 | A path to a TypeScript file exporting the type dictionary interface you want Tyson to use. For more info on type dictionaries, please refer to [`Concepts`](./concepts.md#type-dictionaries).                                                                                                                    | `./src/typeDict.ts`                            |
| `--out`                                                                        | `<output-file>`                    | A path pointing to where you want Tyson to emit the generated TypeScript file. The file does not need to already exist, but the containing directory does (e.g., if you want to pass `./src/generated/semanticActions.generated.ts`, then the directory `./src/generated/` must exist prior to running `tyson`). | `./src/generated/semanticActions.generated.ts` |
| `--type-dict-interface`                                                        | `<type-dict-interface>` (optional) | The name of the type dictionary interface the generated file should import from your type dictionary file. If this argument is omitted, it will default to `TysonTypeDictionary`.                                                                                                                                | `YourTysonTypeDict`                            |
| `--emit-unused-locations`                                                      | None                               | If this flag is enabled, `yylstack` will have a location field for each symbol in the production RHS, regardless of whether that symbol's location is used by the semantic action or not.                                                                                                                        | N/A                                            |
| `--emit-unused-semantic-value-params`                                          | None                               | If this flag is enabled, a semantic value parameter will be emitted for each symbol in a production's RHS, regardless of whether the semantic action uses it or not.                                                                                                                                             | N/A                                            |

### Examples

Simple:

```sh
tyson ./grammar/myAwesomeGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts
```

With explicit `--in` flag (behaves exactly the same as the first example):

```sh
tyson --in ./grammar/myAwesomeGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts
```

Custom type dictionary interface name:

```sh
tyson ./grammar/myAwesomeGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts --type-dict-interface MyCustomTysonTypeDict
```

Emit unused symbol locations:

```sh
tyson ./grammar/myAwesomeGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts --emit-unused-locations
```

Emit unused semantic value parameters:

```sh
tyson ./grammar/myAwesomeGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts --emit-unused-semantic-value-params
```

Emit unused symbol locations and unused semantic value parameters:

```sh
tyson ./grammar/myAwesomeGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts --emit-unused-locations --emit-unused-semantic-value-params
```
