import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// User site (knez4.github.io) is served from the domain root, so no `base` is needed.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          router: ['react-router-dom'],
        },
      },
    },
  },
});
