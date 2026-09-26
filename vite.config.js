import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-router')) return 'react-router';
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion-vendor';
            if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
            if (id.includes('react-icons')) return 'icons-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});