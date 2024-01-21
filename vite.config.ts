import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    /**
     * The library shouldn't minified.
     */
    minify: false,
    lib: {
      entry: path.resolve(process.cwd(), './src/index.ts'),
    },
    rollupOptions: {
      input: {
        index: 'src/index.ts',
      },
      external: ['react', 'react-dom'],
      output: [
        {
          dir: 'dist',
          entryFileNames: '[name].js',
          chunkFileNames: '[name]-[chunk].js',
          format: 'esm',
          exports: 'named',
          preserveModules: true,
        },
        {
          dir: 'dist',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name]-[chunk].cjs',
          format: 'cjs',
          exports: 'named',
          preserveModules: true,
        },
      ],
    },
  },
});
