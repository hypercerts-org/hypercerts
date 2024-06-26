import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./test/setup-env.ts",
    exclude: [...defaultExclude, "./lib/**/*"],
  },
});
