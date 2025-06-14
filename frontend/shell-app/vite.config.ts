

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import federation from '@originjs/vite-plugin-federation';

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: 'shellApp',
//       remotes: {
//         // solicitanteApp: 'http://localhost:3001/assets/remoteEntry.js',
//         // aprobadorApp: 'http://localhost:3002/assets/remoteEntry.js'
//         solicitanteApp: 'https://d29s8542ekmrtz.cloudfront.net/solicitante/assets/remoteEntry.js',
//         aprobadorApp: 'https://d29s8542ekmrtz.cloudfront.net/aprobador/assets/remoteEntry.js'
//       },
//       shared: ['react', 'react-dom', 'react-router-dom']
//     })
//   ],
//   server: {
//     port: 3000
//   },
//   build: {
//     target: 'esnext', // 🛠️ Soporte para top-level await
//     minify: false, // Opcional, puedes quitar si deseas minificar
//     rollupOptions: {
//       output: {
//         manualChunks: undefined
//       }
//     }
//   },
//   esbuild: {
//     target: 'esnext' // 🛠️ Esbuild también debe soportar esnext
//   }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  base: '/shell/', // 👈 Esto es CLAVE si lo estás desplegando en s3://bucket/shell/
  plugins: [
    react(),
    federation({
      name: 'shellApp',
      remotes: {
        solicitanteApp: 'https://d1c7drnfc9stg6.cloudfront.net/solicitante/assets/remoteEntry.js',
        aprobadorApp: 'https://d1c7drnfc9stg6.cloudfront.net/aprobador/assets/remoteEntry.js'
        // solicitanteApp: 'http://localhost:3001/assets/remoteEntry.js',
        // aprobadorApp: 'http://localhost:3003/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext',
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  esbuild: {
    target: 'esnext'
  }
});
