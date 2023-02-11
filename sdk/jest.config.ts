/** @type {import("ts-jest").JestConfigWithTsJest} */
export default {
  setupFiles: ["./test/setup-tests.ts"],
  preset: "ts-jest/presets/js-with-ts-esm", // or other ESM presets,
  rootDir: ".",
  moduleDirectories: ["node_modules", "src", ".graphclient"],
  verbose: false,
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "jsx", "json", "ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    // ".graphclient/(.*)": "<rootDir>/.graphclient/$1",
    // "resources/(.*)": "<rootDir>/resources/$1",
    // "types/(.*)": "<rootDir>/src/types/$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
