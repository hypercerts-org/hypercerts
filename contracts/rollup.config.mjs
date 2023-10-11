import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import autoExternal from "rollup-plugin-auto-external";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default [
  {
    input: `build/index.js`,
    plugins: [
      autoExternal(),
      nodePolyfills(),
      json(),
      commonjs(),
      nodeResolve(),
      esbuild({ tsconfig: "tsconfig.build.json" }),
    ],
    output: [
      {
        format: "esm",
        dir: "dist/esm",
        sourcemap: true,
        exports: "named",
      },
      {
        format: "cjs",
        dir: "dist/cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
  },
  {
    input: `build/index.d.ts`,
    plugins: [json(), dts()],
    output: {
      file: `dist/index.d.ts`,
    },
  },
];
