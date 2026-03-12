import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

export default defineConfig({
  // BDD Configuration - links features to step definitions
  testDir: defineBddConfig({
    paths: ['features/**/*.feature'],      // Feature file location
    require: ['steps/**/*.ts'],            // Step definitions location
  }),

  fullyParallel: false,                    // Sequential execution
  retries: process.env.CI ? 2 : 0,        // Retry failed tests on CI
  workers: process.env.CI ? 1 : undefined, // Parallel workers

  // Reporters
  reporter: [
    ['html', { outputFolder: 'html-report', open: 'never' }],
    ['allure-playwright'],
  ],

  // Timeouts
  timeout: 90000,                          // Test timeout (90s)
  expect: { timeout: 90000 },             // Assertion timeout

  use: {
    actionTimeout: 90000,                  // Action timeout
    navigationTimeout: 60000,             // Navigation timeout
    trace: 'on-first-retry',              // Trace on retry
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,                   // Run with browser UI
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
      },
    },
  ],
});
