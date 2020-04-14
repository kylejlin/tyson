import path from "path";

const DUMMY_PATH_TO_TYSON_REPO = "pathToTysonRepo";

const pathToTysonRepo = removeTrailingPathSeparator(
  path.join(__dirname, "..", "..")
);

/**
 * Normalizes the child paths of the Tyson repository in an error
 * message so they will be the same across all devices.
 * This is necessary for Jest snapshot testing.
 *
 * For example, if one developer clones Tyson into the directory
 * `/Users/kyle/tyson` and another developer clones Tyson into
 * the directory `C:\\Users\janedoe\hacktoberfest\tyson`, then
 * the absolute path to any given resource (e.g, `./test/fixtures`)
 * will be different for each user (in this case, `/Users/kyle/tyson/test/fixtures`
 * and `C:\\Users\janedoe\hacktoberfest\tyson\test\fixtures`, respectively).
 * As a result, Jest snapshot comparisons will fail.
 */
export function normalizeTysonPathsInErrorMessage({ message }: Error): Error {
  return new Error(
    message.replace(
      new RegExp(
        regexEscape(removeTrailingPathSeparator(pathToTysonRepo)) + "(\\S*)",
        "g"
      ),
      (_match, relativePath) =>
        "/" + path.posix.join(DUMMY_PATH_TO_TYSON_REPO, relativePath)
    )
  );
}

function removeTrailingPathSeparator(p: string): string {
  if (p.slice(-1) === path.sep) {
    return p.slice(0, -1);
  } else {
    return p;
  }
}

function regexEscape(s: string): string {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
