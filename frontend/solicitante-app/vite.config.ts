// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'solicitanteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Solicitudes': './src/routes/solicitante.routes.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 3001
  }
});
