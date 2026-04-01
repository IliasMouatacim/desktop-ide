import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vsixPlugin from '@codingame/monaco-vscode-rollup-vsix-plugin';

export default defineConfig({
  plugins: [react(), vsixPlugin()],
  optimizeDeps: {
    include: ['vscode', '@codingame/monaco-vscode-api']
  },
  resolve: {
    alias: {
      vscode: '@codingame/monaco-vscode-api'
    }
  },
  build: {
    rollupOptions: {
      external: ['@codingame/monaco-vscode-api/vscode/vs/base/browser/cssValue']
    }
  },
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
