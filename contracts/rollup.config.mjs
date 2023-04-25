import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// import typescript from "@rollup/plugin-typescript";
import autoExternal from "rollup-plugin-auto-external";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import nodePolyfills from "rollup-plugin-node-polyfills";
import typescript from "rollup-plugin-typescript2";

let override = { compilerOptions: { declaration: true, declarationDir: "./dist/dst/" } };

export default [
  {
    input: `./src/index.ts`,
    plugins: [
      autoExternal(),
      nodePolyfills(),
      json(),
      commonjs(),
      nodeResolve({ jsnext: true, preferBuiltins: false, browser: true, modulesOnly: true }),
      typescript({ tsconfig: "./tsconfig.build.json", tsconfigOverride: override, useTsconfigDeclarationDir: true }),
    ],
    output: [
      {
        format: "cjs",
        dir: "./dist",
      },
    ],
  },
  {
    input: "./src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "cjs" }],
    plugins: [
      json(),
      dts(),
      del({ hook: "buildEnd", targets: ["./src/index.d.ts", "./src/index.d.ts.map"] }), //<------ New Addition
    ],
  },
];
