import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom', // required for React Testing Library
  // },
});
