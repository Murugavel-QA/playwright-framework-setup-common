import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for ai-playwright-automation.
 *
 * Key settings to customise before running:
 *   baseURL – set this to your application's root URL (see below).
 *
 * Full reference: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory where Playwright looks for test files
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failing tests once locally, twice on CI
  retries: process.env.CI ? 2 : 1,

  // Use a single worker locally (increase for faster parallel runs)
  workers: process.env.CI ? 1 : undefined,

  // Reporter: HTML report + console list
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // -----------------------------------------------------------------------
    // ✏️  SET YOUR APPLICATION URL HERE
    // -----------------------------------------------------------------------
    // baseURL: 'http://localhost:3000',
    // baseURL: 'https://staging.example.com',
    // -----------------------------------------------------------------------

    // Collect trace on first retry; useful for debugging failures
    trace: 'on-first-retry',

    // Take screenshots on test failure
    screenshot: 'only-on-failure',

    // Record video on first retry
    video: 'on-first-retry',

    // Default navigation timeout (ms)
    navigationTimeout: 30_000,

    // Default action timeout (ms)
    actionTimeout: 10_000,
  },

  // Configure the browsers to run tests against
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
