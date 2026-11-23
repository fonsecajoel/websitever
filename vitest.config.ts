import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: { include: ['src/lib/pricing.ts', 'src/lib/pix.ts', 'src/lib/server/orders.ts'], thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 } },
  },
});
