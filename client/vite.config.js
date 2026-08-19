import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://gitreport-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'https://gitreport-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
