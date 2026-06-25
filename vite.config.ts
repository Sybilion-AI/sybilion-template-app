import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

import { sybilionStandaloneViteDev } from './dev-server';

export default defineConfig(({ mode }) => ({
  ...sybilionStandaloneViteDev({ mode }),
  plugins: [tailwindcss(), react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    alias: [
      {
        find: '@',
        replacement: path.resolve('./src'),
      },
      {
        find: /^@radix-ui\//,
        replacement: path.resolve('./node_modules/@radix-ui/') + '/',
      },
    ],
  },
}));
