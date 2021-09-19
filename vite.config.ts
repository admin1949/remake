import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@store': resolve('./src/store/index.ts'),
      '@remake': resolve('./src/remake/index.ts'),
      '@pages': resolve('./src/pages'),
      '@styles': resolve('./src/assets/styles')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@styles/var.scss";'
      }
    }
  },
  base: '/remake/'
})
