import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/default-esm",
  setupFiles: ["./test/setup-env.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  rootDir: ".",
  moduleDirectories: ["node_modules", "src"],
  verbose: false,
  // moduleFileExtensions: ["js", "jsx", "json"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    // ".graphclient/(.*)": "<rootDir>/.graphclient/$1",
    // "resources/(.*)": "<rootDir>/resources/$1",
    // "types/(.*)": "<rootDir>/src/types/$1",
  },
  // transform: { "^.+\\.ts?$": "ts-jest" },
  // // transform: {
  // //   // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
  // //   // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
  // //   "^.+\\.[tj]sx?$": "ts-jest",
  // // },
  // transformIgnorePatterns: ["node_modules/(?!@hypercerts-org/contracts)"],
};

export default config;
