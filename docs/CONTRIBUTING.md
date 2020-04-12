# Contributing

If you want to report a bug or request a feature, please do so by opening an issue.
If you could additionally open an accompanying pull request, that would be greatly appreciated.

## Non-goals

I do not plan on implementing any of the following features in the distant future:

- Support for EBNF Jison grammars
- Support for grammar syntax extensions introduced by the [Gerhobbelt Jison fork](https://github.com/GerHobbelt/jison/)

However, if for some reason you really want Tyson to support one of the above features, you're welcome to implement it yourself and open a pull request.

## FAQ

- **Why is `lex-parser` declared as a dependency in `package.json`?**

  If you're wondering why `lex-parser` is listed as a dependency in `package.json`, it's because `ebnf-parser` depends on it but incorrectly lists it as a devDependency in its own `package.json`.
  Consequently, in order to ensure `lex-parser` will be installed, it is declared as a (direct) dependency of _this_ package, despite only actually being a transitive dependency.
