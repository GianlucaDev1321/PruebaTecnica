
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  base: '/aprobador/',
  plugins: [
    react(),
    federation({
      name: 'aprobador_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Aprobador': './src/routes/aprobador.routes.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3003,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: [...configDefaults.exclude, 'dist']
  }
});
