import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: false,
    // Process @sybilion/uilib (and its @homecode/ui dep) through vite instead of
    // externalising them, so the react/react-dom aliases below collapse the
    // nested React copy @homecode/ui ships. Without this, rendering any uilib
    // component that uses @homecode/ui (e.g. Card -> Scroll) throws "Invalid hook
    // call" in jsdom. The prod build dedupes through Rollup and is unaffected.
    server: {
      deps: {
        inline: [/@sybilion\/uilib/, /@homecode\/ui/],
      },
    },
  },
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
      // Force a single React copy in jsdom: some @sybilion/uilib components pull a
      // nested react via @homecode/ui, which `dedupe` alone does not collapse and
      // triggers "Invalid hook call" in tests. The prod build dedupes through Rollup.
      { find: 'react-dom', replacement: path.resolve('./node_modules/react-dom') },
      { find: 'react', replacement: path.resolve('./node_modules/react') },
    ],
  },
});
