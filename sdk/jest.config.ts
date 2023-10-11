import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/js-with-ts-esm", // or other ESM presets,
  setupFiles: ["./test/setup-env.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  rootDir: ".",
  moduleDirectories: ["node_modules", "src"],
  verbose: false,
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "jsx", "json", "ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!@hypercerts-org/contracts)"],
};

export default config;
