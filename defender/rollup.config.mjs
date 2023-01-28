import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import builtins from "builtin-modules";

const config = {
  input: "src/auto-tasks/addAllowlistEntriesToCache.js",
  output: {
    file: "build/relay/index.js",
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    typescript({
      tsconfig: false,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
    }),
    resolve({ preferBuiltins: true }),
    commonjs(),
    json({ compact: true }),
  ],
  external: [
    ...builtins,
    "ethers",
    "web3",
    "axios",
    /^defender-relay-client(\/.*)?$/,
  ],
};

export default config;
