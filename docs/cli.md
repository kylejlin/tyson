# CLI Docs

## Installation

You have three choices:

1. Use in package.json script (RECOMMENDED):

   ```sh
   npm install --save-dev @kylejlin/tyson
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
   npx @kylejlin/tyson -- ./myGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts
   ```

3. Install globally:

   ```sh
   npm install -g @kylejlin/tyson

   tyson ./myGrammar.jison ./src/typeDict.ts --out ./src/generated/semanticActions.generated.ts
   ```

## Usage

```sh
tyson <grammar-file> <type-dict-file> --out <output-file> [--type-dict-interface <type-dict-interface>]
```

### Arguments

| Argument                           | Description                                                                                                                                                                                                                                                                                                      | Example value                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `<grammar-file>`                   | A path to the `.jison` file you want Tyson to use.                                                                                                                                                                                                                                                               | `./grammar/myAwesomeGrammar.jison`             |
| `<type-dict-file>`                 | A path to a TypeScript file exporting the type dictionary interface you want Tyson to use. For more info on type dictionaries, please refer to [`Concepts`](./concepts.md#type-dictionaries).                                                                                                                    | `./src/typeDict.ts`                            |
| `<output-file>`                    | A path pointing to where you want Tyson to emit the generated TypeScript file. The file does not need to already exist, but the containing directory does (e.g., if you want to pass `./src/generated/semanticActions.generated.ts`, then the directory `./src/generated/` must exist prior to running `tyson`). | `./src/generated/semanticActions.generated.ts` |
| `<type-dict-interface>` (optional) | The name of the type dictionary interface the generated file should import from your type dictionary file. If this argument is omitted, it will default to `TysonTypeDictionary`.                                                                                                                                | `YourTysonTypeDict`                            |
