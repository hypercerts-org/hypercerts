import type { Config } from "jest";

const config: Config = {
  extensionsToTreatAsEsm: [".ts"],
  testEnvironment: "node",
  preset: "ts-jest", // or other ESM presets,
  setupFiles: ["./test/setup-env.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  rootDir: ".",
  moduleDirectories: ["node_modules", "<rootDir>/src", ".graphclient"],
  verbose: false,
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "jsx", "json", "ts", "json", "node"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!@hypercerts-org/contracts)"],
};

export default config;
