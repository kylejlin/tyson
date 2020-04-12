# Tyson

A tool that generates a TypeScript file from your Jison grammar's semantic actions so the TypeScript compiler will check those semantic actions for errors.

## Motivation

TypeScript does not examine `.jison` files, so any errors in your semantic action code will not be caught by the compiler.
Tyson generates a TypeScript file containing your semantic action code, so TypeScript can check your semantic actions for errors.

## Usage

Tyson provides both a CLI and a Node API.

### CLI

```sh
npx @kylejlin/tyson -- ./grammar.jison ./src/typedict.ts --out ./src/generated/semanticActions.generated.ts
```

For more information, please refer to the [CLI docs](./docs/cli.md).

### Node API

```sh
npm install --save @kylejlin/tyson
```

```ts
import { generateTypeScriptFile } from "@kylejlin/tyson";

generateTypeScriptFile({
    pathToBnfGrammarFile: /* ... */,
    pathToTypeDictFile: /* ... */,
    pathToOutputFile: /* ... */,
});
```

For more information, please refer to the [Node API docs](./docs/nodeApi.md).

## License

MIT

Copyright (c) 2020 Kyle Lin

## Contributing

Please refer to [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).
