import fs from "fs";
import { toMatchFile } from "jest-file-snapshot";
import path from "path";
import rimraf from "rimraf";
import { generateTypeScriptFile, TysonConfig } from "../src/";
import { getErrorDiagnostics } from "./util/compiler";
import { normalizeTysonPathsInErrorMessage } from "./util/deviceAgnosticPathNormalization";

expect.extend({ toMatchFile });

beforeAll(() => {
  rimraf.sync(path.join(__dirname, "./tempIndexTest"));
  fs.mkdirSync(path.join(__dirname, "./tempIndexTest"));
  fs.mkdirSync(path.join(__dirname, "./tempIndexTest/noTypeErrors"));
  fs.mkdirSync(path.join(__dirname, "./tempIndexTest/typeErrors"));
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
      "tempIndexTest/noTypeErrors",
      dir + ".generated.ts"
    );
    const pathToConfigFile = path.join(
      __dirname,
      "fixtures/shouldSucceed",
      dir,
      "config.json"
    );

    const config = getConfig(pathToConfigFile);

    generateTypeScriptFile({
      pathToBnfGrammarFile,
      pathToTypeDictFile,
      pathToOutputFile,
      ...config,
    });

    expect(getErrorDiagnostics([pathToOutputFile])).toHaveLength(0);

    const pathToFileSnapshot = path.join(
      __dirname,
      "__file_snapshots__/noTypeErrors/",
      dir + ".ts"
    );
    expect(fs.readFileSync(pathToOutputFile, "utf8")).toMatchFile(
      pathToFileSnapshot
    );
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
      "tempIndexTest/typeErrors",
      dir + ".generated.ts"
    );
    const pathToConfigFile = path.join(
      __dirname,
      "fixtures/shouldFail",
      dir,
      "config.json"
    );

    const config = getConfig(pathToConfigFile);

    try {
      generateTypeScriptFile({
        pathToBnfGrammarFile,
        pathToTypeDictFile,
        pathToOutputFile,
        ...config,
      });
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

      const pathToFileSnapshot = path.join(
        __dirname,
        "__file_snapshots__/typeErrors/",
        dir + ".ts"
      );
      expect(fs.readFileSync(pathToOutputFile, "utf8")).toMatchFile(
        pathToFileSnapshot
      );
    }
  });
});

function getConfig(pathToConfigFile: string): Partial<TysonConfig> {
  if (fs.existsSync(pathToConfigFile)) {
    return JSON.parse(fs.readFileSync(pathToConfigFile, "utf8"));
  } else {
    return {};
  }
}
