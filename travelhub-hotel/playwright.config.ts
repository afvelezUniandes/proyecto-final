// @ts-check
/// <reference types="node" />
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  tsconfig: './tsconfig.playwright.json',
  timeout: 30000,
  use: {
    baseURL: process.env['PLAYWRIGHT_BASE_URL'] || 'http://localhost:4201',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
      testMatch: process.env['CI'] ? ['**/hotel-auth.spec.ts'] : ['**/*.spec.ts'],
    },
  ],
});
