import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js', // 打包入口
  output: [
    {
      file: './dist/index.umd.js',
      format: 'umd',
      name: 'myLib',
      // banner: '#!/usr/bin/env node',
    },
    {
      file: './dist/index.es.js',
      format: 'es',
      // banner: '#!/usr/bin/env node',
    },
    {
      file: './dist/index.cjs.js',
      format: 'cjs',
      // banner: '#!/usr/bin/env node',
    },
  ],
  plugins: [
    json(),
    resolve(),
    commonjs(),
    typescript(),
  ],
};
