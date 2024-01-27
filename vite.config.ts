/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

console.log(process.cwd());

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
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@react-awesome/hooks',
        '@react-awesome/phone-input',
      ],
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
  test: {
    environment: 'node',
    include: [
      /**
       * Unit tests should only apply to helpers function only.
       * For component testing, we should use Functional Test.
       * Thus to avoid unnecessary tests we should use .tsx for components file only.
       */
      './src/**/*.spec.ts',
    ],
    coverage: {
      provider: 'istanbul',
      include: ['**/*.ts'],
      exclude: ['**/*.tsx'],
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 100,
        functions: 100,
        lines: 100,
        branches: 100,
      },
    },
  },
});
