# Tyson

[![Build Status](https://travis-ci.com/kylejlin/tyson.svg?branch=master)](https://travis-ci.com/kylejlin/tyson)
[![Coverage Status](https://coveralls.io/repos/github/kylejlin/tyson/badge.svg?branch=master)](https://coveralls.io/github/kylejlin/tyson?branch=master)
[![npm version](https://badge.fury.io/js/tyson.svg)](https://www.npmjs.com/package/tyson)
[![Downloads](https://img.shields.io/npm/dm/tyson.svg)](https://www.npmjs.com/package/tyson)

A tool that generates a TypeScript file from your Jison grammar's semantic actions so the TypeScript compiler will check those semantic actions for errors.

## Motivation

TypeScript does not examine `.jison` files, so any errors in your semantic action code will not be caught by the compiler.
Tyson generates a TypeScript file containing your semantic action code, so TypeScript can check your semantic actions for errors.

## Usage

Tyson provides both a CLI and a Node API.

### CLI

```sh
npx tyson -- ./grammar.jison ./src/typedict.ts --out ./src/generated/semanticActions.generated.ts
```

For more information, please refer to the [CLI docs](./docs/cli.md).

### Node API

```sh
npm install --save tyson
```

```ts
import { generateTypeScriptFile } from "tyson";

generateTypeScriptFile({
    pathToBnfGrammarFile: /* ... */,
    pathToTypeDictFile: /* ... */,
    pathToOutputFile: /* ... */,
});
```

For more information, please refer to the [Node API docs](./docs/nodeApi.md).

## Docs

All documentation is located in the [docs directory](./docs).

We recommend that you start by reading the [General docs](./docs/general.md).
After that, if you want additional information about the CLI or Node API, you can refer to the [CLI docs](./docs/cli.md) or [Node API docs](./docs/nodeApi.md), respectively.

## License

MIT

Copyright (c) 2020 Kyle Lin

## Contributing

Please refer to [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).
