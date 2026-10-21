import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' supaya hasil `npm run build` bisa dibuka dari subfolder
// (misalnya GitHub Pages) tanpa konfigurasi tambahan.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: true
  }
});
