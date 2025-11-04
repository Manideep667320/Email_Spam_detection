import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: command === 'serve' ? {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    port: 5173,
    strictPort: true
  } : {},
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  }
}));
