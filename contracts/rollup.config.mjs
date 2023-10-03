import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default [
  {
    input: `src/index.ts`,
    plugins: [autoExternal(), nodePolyfills(), json(), commonjs(), nodeResolve(), esbuild()],
    output: [
      {
        format: "esm",
        dir: "dist/esm",
      },
      {
        format: "cjs",
        dir: "dist/cjs",
      },
    ],
  },
  {
    input: `src/index.ts`,
    plugins: [json(), dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  },
];
