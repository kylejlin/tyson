module.exports = {
  roots: ["<rootDir>src", "<rootDir>test"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "(.*\\.(test|spec))\\.ts$",
  moduleFileExtensions: ["ts", "js"],
  watchPathIgnorePatterns: ["__file_snapshots__"],
};
