import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import qiankun from 'vite-plugin-qiankun';
import { resolve } from "path";

const { name } = require('./package');

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [vue(), vueJsx(), qiankun('vue3Vite', { useDevMode: true })],
    resolve: {
      extensions: ['.js', 'ts', '.tsx', '.jsx', '.vue', '.styl', '.json'],
        alias: {
          '@': resolve('src'),
          '@api': resolve('src/api'),
          '@img': resolve('src/assets/img'),
          '@config': resolve('src/config'),
          '@mixins': resolve('src/mixins'),
          '@router': resolve('src/router'),
          '@store': resolve('src/store'),
          '@utils': resolve('src/utils'),
          '@layout': resolve('src/layout'),
        },
      },
    server: {
      host: '0.0.0.0',
      port: 9080,
      cors: true,
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
    define: {
      'process.env': env
    }
  }
})
