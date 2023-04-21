import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default [
  {
    input: `./out-tsc/src/index.js`,
    plugins: [
      autoExternal(),
      nodePolyfills(),
      json(),
      commonjs(),
      nodeResolve({ jsnext: true, preferBuiltins: false, browser: true, modulesOnly: true }),
    ],
    output: [
      {
        format: "cjs",
        dir: "dist",
      },
    ],
  },
  {
    input: `out-tsc/src/index.d.ts`,
    plugins: [json(), dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "cjs",
    },
  },
];
