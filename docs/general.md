# Tyson Docs

## Tyson in a nutshell

Tyson needs to know four things in order to generate your TypeScript file:

1. The `.jison` grammar
2. A TypeScript interface that specifies the intended type of each production symbol in the grammar. The interface is specified by two arguments:

   1. The name of the interface.
   2. The path to the file that exports the interface.

   This interface is called a _type dictionary_.

3. The path to output the generated TypeScript file.

For more information on how to specify these four arguments, consult the [CLI docs](./cli.md) or [Node API docs](./nodeApi.md), depending on which one you're using.

## Using `yy`

If your semantic actions reference the `yy` variable, you will need to export a variable named `yy` in the same file that exports the type dictionary.

For example:

```ts
export interface TysonTypeDictionary {
  // ...
}

export declare const yy: Yy;

interface Yy {
  // ...
}
```
