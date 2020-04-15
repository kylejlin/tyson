import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { TysonConfig } from "../src";
import { main } from "../src/cli";
import { getErrorDiagnostics } from "./util/compiler";
import { normalizeTysonPathsInErrorMessage } from "./util/deviceAgnosticPathNormalization";

beforeAll(() => {
  rimraf.sync(path.join(__dirname, "./tempCliTest"));
  fs.mkdirSync(path.join(__dirname, "./tempCliTest"));
  fs.mkdirSync(path.join(__dirname, "./tempCliTest/noTypeErrors"));
  fs.mkdirSync(path.join(__dirname, "./tempCliTest/typeErrors"));
});

test("success cases", () => {
  const dirs = fs.readdirSync(path.join(__dirname, "./fixtures/shouldSucceed"));

  dirs.forEach((dir) => {
    const pathToBnfGrammarFile = path.join(
      __dirname,
      "fixtures/shouldSucceed",
      dir,
      "grammar.jison"
    );
    const pathToTypeDictFile = path.join(
      __dirname,
      "fixtures/shouldSucceed",
      dir,
      "typeDict.ts"
    );
    const pathToOutputFile = path.join(
      __dirname,
      "tempCliTest/noTypeErrors",
      dir + ".generated.ts"
    );
    const pathToConfigFile = path.join(
      __dirname,
      "fixtures/shouldSucceed",
      dir,
      "config.json"
    );

    const extraArgs = getArgsFromConfig(pathToConfigFile);

    main(
      [
        "/dummyPath1",
        "/dummyPath2",
        pathToBnfGrammarFile,
        pathToTypeDictFile,
        "--out",
        pathToOutputFile,
      ].concat(extraArgs)
    );

    expect(getErrorDiagnostics([pathToOutputFile])).toHaveLength(0);
  });
});

test("failure cases", () => {
  const dirs = fs.readdirSync(path.join(__dirname, "./fixtures/shouldFail"));

  dirs.forEach((dir) => {
    const pathToBnfGrammarFile = path.join(
      __dirname,
      "fixtures/shouldFail",
      dir,
      "grammar.jison"
    );
    const pathToTypeDictFile = path.join(
      __dirname,
      "fixtures/shouldFail",
      dir,
      "typeDict.ts"
    );
    const pathToOutputFile = path.join(
      __dirname,
      "tempCliTest/typeErrors",
      dir + ".generated.ts"
    );
    const pathToConfigFile = path.join(
      __dirname,
      "fixtures/shouldFail",
      dir,
      "config.json"
    );

    const extraArgs = getArgsFromConfig(pathToConfigFile);

    try {
      main(
        [
          "/dummyPath1",
          "/dummyPath2",
          pathToBnfGrammarFile,
          pathToTypeDictFile,
          "--out",
          pathToOutputFile,
        ].concat(extraArgs)
      );
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }

      const deviceAgnosticError = normalizeTysonPathsInErrorMessage(e);
      expect(deviceAgnosticError).toMatchSnapshot("error for " + dir);
    }

    if (fs.existsSync(pathToOutputFile)) {
      expect(
        getErrorDiagnostics([pathToOutputFile]).length
      ).toBeGreaterThanOrEqual(1);
    }
  });
});

function getArgsFromConfig(pathToConfigFile: string): string[] {
  const config = getConfig(pathToConfigFile);
  return [
    ...(config.typeDictInterfaceName !== undefined
      ? ["--type-dict-interface", config.typeDictInterfaceName]
      : []),

    ...(config.emitUnusedLocations ? ["--emit-unused-locations"] : []),

    ...(config.emitUnusedSemanticValueParams
      ? ["--emit-unused-semantic-value-params"]
      : []),
  ];
}

function getConfig(pathToConfigFile: string): Partial<TysonConfig> {
  if (fs.existsSync(pathToConfigFile)) {
    return JSON.parse(fs.readFileSync(pathToConfigFile, "utf8"));
  } else {
    return {};
  }
}
