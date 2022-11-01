import 'dotenv/config';
import buble from '@rollup/plugin-buble';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export default {
  input: 'src/library/Tracker/index.js',
  output: {
    file: 'public/bi.js',
    format: 'iife',
    name: 'bi',
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
    json(),
    replace({
      delimiters: ['', ''],
      preventAssignment: true,
    }),
    buble({
      objectAssign: true,
      transforms: {
        // make async/await work by default (no transforms)
        asyncAwait: false,
      },
    }),
    terser({ compress: { evaluate: false } }),
  ],
};
