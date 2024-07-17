import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import autoExternal from "rollup-plugin-auto-external";
import swc from "rollup-plugin-swc3";

export default [
  {
    input: `src/index.ts`,
    plugins: [
      autoExternal(),
      json(),
      nodeResolve({ jsnext: true, preferBuiltins: false, browser: true }),
      swc(),
    ],
    output: [
      {
        format: "esm",
        dir: "dist/esm",
        entryFileNames: "index.mjs",
      },
      {
        format: "cjs",
        dir: "dist/cjs",
        entryFileNames: "index.cjs",
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
