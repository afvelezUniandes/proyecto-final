// @ts-check
/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  tsconfig: './tsconfig.playwright.json',
  timeout: 30000,
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:4200',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      // En CI solo corre los specs de auth; localmente corren todos con: npx playwright test
      testMatch: process.env['CI']
        ? ['**/auth.spec.ts', '**/hotel-auth.spec.ts']
        : ['**/*.spec.ts'],
    },
  ],
});
