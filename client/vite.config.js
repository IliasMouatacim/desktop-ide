import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process entry point
        entry: 'electron/main.js',
      },
      {
        // Preload scripts entry point
        entry: 'electron/preload.js',
        onstart(options) {
          // Notify the renderer process to reload when preload scripts are rebuilt
          options.reload();
        },
      },
    ]),
    electronRenderer(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true
      }
    }
  }
});
