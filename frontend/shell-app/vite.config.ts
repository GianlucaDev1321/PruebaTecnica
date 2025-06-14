// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import federation from '@originjs/vite-plugin-federation';

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: 'shellApp',
//       remotes: {
//         solicitanteApp: 'http://localhost:3001/assets/remoteEntry.js',
//         aprobadorApp: 'http://localhost:3002/assets/remoteEntry.js'
//       },
//       shared: ['react', 'react-dom', 'react-router-dom']
//     })
//   ],
//   server: {
//     port: 3000
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shellApp',
      remotes: {
        solicitanteApp: 'http://localhost:3001/assets/remoteEntry.js',
        aprobadorApp: 'http://localhost:3002/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext', // 🛠️ Soporte para top-level await
    minify: false, // Opcional, puedes quitar si deseas minificar
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  esbuild: {
    target: 'esnext' // 🛠️ Esbuild también debe soportar esnext
  }
});
