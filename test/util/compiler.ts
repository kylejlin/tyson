import * as ts from "typescript";
import path from "path";
import fs from "fs";

const tsConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../tsconfig.json"), "utf8")
);

export function getErrorDiagnostics(
  fileNames: string[]
): readonly ts.Diagnostic[] {
  return getPreEmitDiagnostics(fileNames).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );
}

function getPreEmitDiagnostics(fileNames: string[]): readonly ts.Diagnostic[] {
  const options = getTsConfigCompilerOptions();
  const program = ts.createProgram(fileNames, options);
  return ts.getPreEmitDiagnostics(program);
}

function getTsConfigCompilerOptions(): ts.CompilerOptions {
  return ts.convertCompilerOptionsFromJson(
    tsConfig.compilerOptions,
    path.join(__dirname, "../../")
  ).options;
}
