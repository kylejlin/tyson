#! /usr/bin/env node

import { Result, result } from "rusty-ts";
import { generateTypeScriptFile, TysonConfig } from ".";
import fs from "fs";
import path from "path";
import TYSON_VERSION from "./packageVersion.generated";

type TysonCommand =
  | InvalidCommand
  | TysonHelpCommand
  | TysonVersionCommand
  | TysonGenerateCommand;

enum CommandType {
  Invalid,

  Help,
  Version,
  GenerateTypescriptFile,
}

interface InvalidCommand {
  commandType: CommandType.Invalid;
  error: InvalidTysonConfigError;
}

interface TysonHelpCommand {
  commandType: CommandType.Help;
}

interface TysonVersionCommand {
  commandType: CommandType.Version;
}

interface TysonGenerateCommand {
  commandType: CommandType.GenerateTypescriptFile;
  config: TysonConfig;
}

type InvalidTysonConfigError =
  | InvalidFileError
  | WrongTypeOfFileError
  | DuplicateGrammarFileDefsError
  | DuplicateTypeDictFileDefsError
  | DuplicateOutputFileDefsError
  | DuplicateTypeDictInterfaceDefsError
  | MissingRequiredArgsError;

enum InvalidTysonConfigErrorType {
  InvalidFile,
  WrongTypeOfFile,
  DuplicateGrammarFileDefs,
  DuplicateTypeDictFileDefs,
  DuplicateOutputFileDefs,
  DuplicateTypeDictInterfaceDefs,
  MissingRequiredArgs,
}

interface InvalidFileError {
  errorType: InvalidTysonConfigErrorType.InvalidFile;

  path: string;
}

interface WrongTypeOfFileError {
  errorType: InvalidTysonConfigErrorType.WrongTypeOfFile;

  expectedExtensions: string[];
  actualPath: string;
}

interface DuplicateGrammarFileDefsError {
  errorType: InvalidTysonConfigErrorType.DuplicateGrammarFileDefs;

  paths: [string, string];
}

interface DuplicateTypeDictFileDefsError {
  errorType: InvalidTysonConfigErrorType.DuplicateTypeDictFileDefs;

  paths: [string, string];
}

interface DuplicateOutputFileDefsError {
  errorType: InvalidTysonConfigErrorType.DuplicateOutputFileDefs;

  paths: [string, string];
}

interface DuplicateTypeDictInterfaceDefsError {
  errorType: InvalidTysonConfigErrorType.DuplicateTypeDictInterfaceDefs;

  interfaceNames: [string, string];
}

interface MissingRequiredArgsError {
  errorType: InvalidTysonConfigErrorType.MissingRequiredArgs;

  missingArgs: ("grammar-file" | "type-dict-file" | "output-file")[];
}

const HELP_TEXT = `A tool that generates a TypeScript file from your Jison grammar's semantic actions so you can typecheck those semantic actions.

USAGE:
    tyson <grammar-file> <type-dict-file> --out <output-file> [--type-dict-interface <type-dict-interface>]

OPTIONS:
    -h, --help       Prints the help info
    -v, --version    Prints the version info and exits
    
ARGUMENTS:
    <grammar-file>                      A Jison file
    <type-dict-file>                    A TypeScript file that exports a \`TysonTypeDictionary\` interface
    <output-file>                       The file to the generated code should be written to
    <type-dict-interface> (optional)    The name of the type dictionary interface. Defaults to "TysonTypeDictionary"
`;

if (require.main === module) {
  main(process.argv);
}

export function main(argv: string[]) {
  const args = argv.slice(2);
  const command = getCommand(args);
  handleCommand(command);
}

function getCommand(args: string[]): TysonCommand {
  if (args.length === 0) {
    return { commandType: CommandType.Help };
  }

  if (args[0] === "-h" || args[0] === "--help") {
    return { commandType: CommandType.Help };
  }
  if (args[0] === "-v" || args[0] === "--version") {
    return { commandType: CommandType.Version };
  }

  const config = getConfig(args);

  return config.match({
    err: (error) => {
      return { commandType: CommandType.Invalid, error };
    },

    ok: (config) => {
      return { commandType: CommandType.GenerateTypescriptFile, config };
    },
  });
}

function getConfig(
  args: string[]
): Result<TysonConfig, InvalidTysonConfigError> {
  enum AcceptMode {
    JisonAndTypeDict,
    OutputFile,
    TypeDictInterfaceName,
  }

  let mode = AcceptMode.JisonAndTypeDict;

  let pathToBnfGrammarFile: string | undefined = undefined;
  let pathToTypeDictFile: string | undefined = undefined;
  let pathToOutputFile: string | undefined = undefined;
  let typeDictInterfaceName: string | undefined = undefined;
  let emitUnusedLocations: true | undefined = undefined;
  let emitUnusedSemanticValueParams: true | undefined = undefined;

  for (const arg of args) {
    if (arg === "--in") {
      mode = AcceptMode.JisonAndTypeDict;
      continue;
    }

    if (arg === "--out" || arg === "-o") {
      mode = AcceptMode.OutputFile;
      continue;
    }

    if (arg === "--type-dict-interface" || arg === "-t") {
      mode = AcceptMode.TypeDictInterfaceName;
      continue;
    }

    if (arg === "--emit-unused-locations") {
      emitUnusedLocations = true;
      continue;
    }

    if (arg === "--emit-unused-semantic-value-params") {
      emitUnusedSemanticValueParams = true;
      continue;
    }

    if (mode === AcceptMode.JisonAndTypeDict) {
      if (/\.jison$/.test(arg)) {
        if (!isValidFile(arg)) {
          return result.err({
            errorType: InvalidTysonConfigErrorType.InvalidFile,
            path: arg,
          });
        }

        if (pathToBnfGrammarFile !== undefined) {
          return result.err({
            errorType: InvalidTysonConfigErrorType.DuplicateGrammarFileDefs,
            paths: [pathToBnfGrammarFile, arg],
          });
        }

        pathToBnfGrammarFile = arg;
        continue;
      }

      if (/\.ts$/.test(arg)) {
        if (!isValidFile(arg)) {
          return result.err({
            errorType: InvalidTysonConfigErrorType.InvalidFile,
            path: arg,
          });
        }

        if (pathToTypeDictFile !== undefined) {
          return result.err({
            errorType: InvalidTysonConfigErrorType.DuplicateTypeDictFileDefs,
            paths: [pathToTypeDictFile, arg],
          });
        }

        pathToTypeDictFile = arg;
        continue;
      }

      return result.err({
        errorType: InvalidTysonConfigErrorType.WrongTypeOfFile,
        expectedExtensions: [".jison", ".ts"],
        actualPath: arg,
      });
    }

    if (mode === AcceptMode.OutputFile) {
      if (/\.ts$/.test(arg)) {
        if (pathToOutputFile !== undefined) {
          return result.err({
            errorType: InvalidTysonConfigErrorType.DuplicateOutputFileDefs,
            paths: [pathToOutputFile, arg],
          });
        }

        pathToOutputFile = arg;
        continue;
      }

      return result.err({
        errorType: InvalidTysonConfigErrorType.WrongTypeOfFile,
        expectedExtensions: [".ts"],
        actualPath: arg,
      });
    }

    if (mode === AcceptMode.TypeDictInterfaceName) {
      if (typeDictInterfaceName !== undefined) {
        return result.err({
          errorType: InvalidTysonConfigErrorType.DuplicateTypeDictInterfaceDefs,
          interfaceNames: [typeDictInterfaceName, arg],
        });
      }

      typeDictInterfaceName = arg;
      continue;
    }
  }

  if (
    pathToBnfGrammarFile !== undefined &&
    pathToTypeDictFile !== undefined &&
    pathToOutputFile !== undefined
  ) {
    return result.ok({
      pathToBnfGrammarFile,
      pathToTypeDictFile,
      pathToOutputFile,
      typeDictInterfaceName,
      emitUnusedLocations,
      emitUnusedSemanticValueParams,
    });
  } else {
    return result.err({
      errorType: InvalidTysonConfigErrorType.MissingRequiredArgs,
      missingArgs: [
        ...((pathToBnfGrammarFile === undefined ? ["grammar-file"] : []) as
          | ["grammar-file"]
          | []),
        ...((pathToTypeDictFile === undefined ? ["type-dict-file"] : []) as
          | ["type-dict-file"]
          | []),
        ...((pathToOutputFile === undefined ? ["output-file"] : []) as
          | ["output-file"]
          | []),
      ],
    });
  }
}

function isValidFile(p: string): boolean {
  const absolutePath = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  return fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isFile();
}

function handleCommand(command: TysonCommand): void {
  switch (command.commandType) {
    case CommandType.Invalid:
      handleInvalidCommand(command);
      break;
    case CommandType.Help:
      handleHelpCommand();
      break;
    case CommandType.Version:
      handleVersionCommand();
      break;
    case CommandType.GenerateTypescriptFile:
      handleGenerateCommand(command);
      break;
  }
}

function handleInvalidCommand(command: InvalidCommand): void {
  const { error } = command;
  switch (error.errorType) {
    case InvalidTysonConfigErrorType.InvalidFile:
      handleInvalidFileError(error);
      break;
    case InvalidTysonConfigErrorType.WrongTypeOfFile:
      handleWrongTypeOfFileError(error);
      break;
    case InvalidTysonConfigErrorType.DuplicateGrammarFileDefs:
      handleDuplicateGrammarFileDefsError(error);
      break;
    case InvalidTysonConfigErrorType.DuplicateTypeDictFileDefs:
      handleDuplicateTypeDictFileDefsError(error);
      break;
    case InvalidTysonConfigErrorType.DuplicateOutputFileDefs:
      handleDuplicateOutputFileDefsError(error);
      break;
    case InvalidTysonConfigErrorType.DuplicateTypeDictInterfaceDefs:
      handleDuplicateTypeDictInterfaceDefsError(error);
      break;
    case InvalidTysonConfigErrorType.MissingRequiredArgs:
      handleMissingRequiredArgsError(error);
      break;
  }
}

function handleInvalidFileError(error: InvalidFileError): void {
  console.log('No file named "' + error.path + '" exists.');
  process.exit(1);
}

function handleWrongTypeOfFileError(error: WrongTypeOfFileError): void {
  console.log(
    "Expecting a file with one of the following extensions: [" +
      error.expectedExtensions.map((ext) => '"' + ext + '"').join(", ") +
      '], but received "' +
      error.actualPath +
      '".'
  );
  process.exit(1);
}

function handleDuplicateGrammarFileDefsError(
  error: DuplicateGrammarFileDefsError
): void {
  console.log(
    'Duplicate grammar file definitions:\n    First:  "' +
      error.paths[0] +
      '"\n    Second: "' +
      error.paths[1] +
      '"'
  );
}

function handleDuplicateTypeDictFileDefsError(
  error: DuplicateTypeDictFileDefsError
): void {
  console.log(
    'Duplicate type dictionary file definitions:\n    First:  "' +
      error.paths[0] +
      '"\n    Second: "' +
      error.paths[1] +
      '"'
  );
}

function handleDuplicateOutputFileDefsError(
  error: DuplicateOutputFileDefsError
): void {
  console.log(
    'Duplicate output file definitions:\n    First:  "' +
      error.paths[0] +
      '"\n    Second: "' +
      error.paths[1] +
      '"'
  );
}

function handleDuplicateTypeDictInterfaceDefsError(
  error: DuplicateTypeDictInterfaceDefsError
): void {
  console.log(
    'Duplicate type dictionary interface definitions:\n    First:  "' +
      error.interfaceNames[0] +
      '"\n    Second: "' +
      error.interfaceNames[1] +
      '"'
  );
}

function handleMissingRequiredArgsError(error: MissingRequiredArgsError): void {
  console.log(
    "Missing the following required arguments: [" +
      error.missingArgs.join(", ") +
      "]."
  );
  process.exit(1);
}

function handleHelpCommand(): void {
  console.log(HELP_TEXT);
}

function handleVersionCommand(): void {
  console.log("tyson " + TYSON_VERSION);
}

function handleGenerateCommand(command: TysonGenerateCommand): void {
  generateTypeScriptFile(command.config);
}
