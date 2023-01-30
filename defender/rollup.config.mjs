import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import builtins from "builtin-modules";

const createConfig = (fileName) => ({
  input: `src/auto-tasks/${fileName}.ts`,
  output: {
    file: `build/relay/${fileName}/index.js`,
    format: "cjs",
    exports: "auto",
  },
  plugins: [
    typescript({
      tsconfig: false,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      downlevelIteration: true,
    }),
    resolve({ preferBuiltins: true }),
    commonjs({
      ignoreDynamicRequires: true,
    }),
    json({ compact: true }),
  ],
  external: [
    ...builtins,
    "ethers",
    "web3",
    "axios",
    "crypto",
    /^defender-relay-client(\/.*)?$/,
  ],

})

const files = [
  'on-allowlist-created',
  'batch-mint-claims-from-allowlists',
]

const configs = files.map(file => createConfig(file));

export default configs;
