import path from 'node:path';
import process from 'node:process';
import { loadEnv } from 'vite';
import type { ConfigEnv, UserConfig } from 'vite';
import viewport from 'postcss-mobile-forever';
import autoprefixer from 'autoprefixer';
import { createVitePlugins } from './build/vite';
import { exclude, include } from './build/vite/optimize';

export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(mode),

    server: {
      host: true,
      port: 3000,
      proxy: {
        '/api': {
          target: '',
          ws: false,
          changeOrigin: true,
        },
      },
    },

    resolve: {
      alias: {
        '~@': path.join(__dirname, './src'),
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src/assets'),
        '~root': path.join(__dirname, '.'),
        // 'ethers': 'ethers/dist/ethers.cjs.js',
      },
    },

    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          // https://github.com/wswmsword/postcss-mobile-forever
          viewport({
            appSelector: '#app',
            viewportWidth: 375,
            maxDisplayWidth: 600,
            rootContainingBlockSelectorList: ['van-tabbar', 'van-popup'],
            border: true,
          }),
        ],
      },
    },

    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048,
      outDir: env.VITE_APP_OUT_DIR || 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
      // target: ['chrome64', 'edge79', 'es2020', 'firefox67', 'safari12', 'esnext'],
      target: ['esnext'],
    },
    optimizeDeps: {
      include,
      exclude,
      esbuildOptions: {
        target: 'esnext',
        define: {
          global: 'globalThis',
        },
        supported: {
          bigint: true,
        },
      },
    },
  };
};
