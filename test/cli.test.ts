import fs from "fs";
import path from "path";
import rimraf from "rimraf";
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
      "fixtures/shouldSucceed/" + dir + "/" + dir + ".jison"
    );
    const pathToTypeDictFile = path.join(
      __dirname,
      "fixtures/shouldSucceed/" + dir + "/" + dir + ".ts"
    );
    const pathToOutputFile = path.join(
      __dirname,
      "./tempCliTest/noTypeErrors/" + dir + ".generated.ts"
    );

    main([
      "/dummyPath1",
      "/dummyPath2",
      pathToBnfGrammarFile,
      pathToTypeDictFile,
      "--out",
      pathToOutputFile,
    ]);

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
      "./tempCliTest/typeErrors/" + dir + ".generated.ts"
    );

    try {
      main([
        "/dummyPath1",
        "/dummyPath2",
        pathToBnfGrammarFile,
        pathToTypeDictFile,
        "--out",
        pathToOutputFile,
      ]);
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
