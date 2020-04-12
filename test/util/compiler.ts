import * as ts from "typescript";
import path from "path";

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
    undefined,
    path.join(__dirname, "../../")
  ).options;
}
