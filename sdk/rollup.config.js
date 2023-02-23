import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import  { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
  {
    input: `src/index.ts`,
    plugins: [ 
        nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }), 
        json(), 
        commonjs({     include: /node_modules/,
        requireReturnsDefault: 'auto',}), 
        esbuild()],
    output: [
      {
        dir: `dist`,
        sourcemap: true,
        // exports: 'default',
      },
    ]
  },
  {
    input: `src/index.ts`,
    plugins: [dts()],
    output: {
      file: `dist/bundle.d.ts`,
      format: 'es',
    },
  }
]