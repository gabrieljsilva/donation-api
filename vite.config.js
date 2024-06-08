import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    mockReset: false,
    exclude: [
      '**/prisma/seeds/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**./*.e2e-spec.ts{x}',
    ],
    coverage: {
      reportsDirectory: 'coverage',
      reporter: ['json', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      // exclude: ['prisma/seeds/**'],
    },
  },
});
