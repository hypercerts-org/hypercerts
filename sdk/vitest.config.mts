import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: "./test/setup-env.ts",
    watch: false,
    exclude: [...defaultExclude, "./lib/**/*"],
  },
});
