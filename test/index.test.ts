import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { generateTypeScriptFile } from "../src/";
import { getErrorDiagnostics } from "./util/compiler";

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
      "fixtures/shouldSucceed/" + dir + "/" + dir + ".jison"
    );
    const pathToTypeDictFile = path.join(
      __dirname,
      "fixtures/shouldSucceed/" + dir + "/" + dir + ".ts"
    );
    const pathToOutputFile = path.join(
      __dirname,
      "./tempIndexTest/noTypeErrors/" + dir + ".generated.ts"
    );

    generateTypeScriptFile({
      pathToBnfGrammarFile,
      pathToTypeDictFile,
      pathToOutputFile,
    });

    expect(getErrorDiagnostics([pathToOutputFile])).toHaveLength(0);
  });
});

test("failure cases", () => {
  const dirs = fs.readdirSync(path.join(__dirname, "./fixtures/shouldFail"));

  dirs.forEach((dir) => {
    const pathToBnfGrammarFile = path.join(
      __dirname,
      "fixtures/shouldFail/" + dir + "/" + dir + ".jison"
    );
    const pathToTypeDictFile = path.join(
      __dirname,
      "fixtures/shouldFail/" + dir + "/" + dir + ".ts"
    );
    const pathToOutputFile = path.join(
      __dirname,
      "./tempIndexTest/typeErrors/" + dir + ".generated.ts"
    );

    try {
      generateTypeScriptFile({
        pathToBnfGrammarFile,
        pathToTypeDictFile,
        pathToOutputFile,
      });
    } catch (e) {
      expect(e).toMatchSnapshot("error for " + dir);
    }

    if (fs.existsSync(pathToOutputFile)) {
      expect(
        getErrorDiagnostics([pathToOutputFile]).length
      ).toBeGreaterThanOrEqual(1);
    }
  });
});
