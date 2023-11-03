import type { Config } from "jest";

const config: Config = {
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  preset: "ts-jest/presets/js-with-ts-esm", // or other ESM presets,
  setupFiles: ["./test/setup-env.ts"],
  setupFilesAfterEnv: ["jest-extended/all"],
  rootDir: ".",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^@hypercerts-org/contracts$": require.resolve("@hypercerts-org/contracts"), // this is the trick!
  },
  verbose: false,
  resolver: "ts-jest-resolver",
  moduleFileExtensions: ["js", "jsx", "json", "ts"],
  transform: {},
  workerThreads: true,
};

export default config;
