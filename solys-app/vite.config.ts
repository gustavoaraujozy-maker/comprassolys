import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@emotion/styled'],
  },
  plugins: [tsconfigPaths(), react(), viteSingleFile()],
  base: './',
  build: {
    target: 'esnext',
    assetsInlineLimit: 100_000_000, // inline everything (logo, etc.)
    chunkSizeWarningLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
