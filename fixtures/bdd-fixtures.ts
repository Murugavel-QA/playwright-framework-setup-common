import { createBdd } from 'playwright-bdd';
import { test as base } from '@playwright/test';
import { McpRecorder, McpFixtures } from '../utils/mcp-recorder';
import { PageFieldScanner } from '../utils/page-field-scanner';

/**
 * Extended Playwright fixtures that expose:
 *  - `mcpRecorder`   — records all page interactions for data-driven replay
 *  - `fieldScanner`  — scans the current page and auto-generates POM skeletons
 *
 * Import `test` from this file instead of `@playwright/test` when you need
 * the extra fixtures in spec files.
 *
 * For BDD step definitions use `createBdd(test)` instead of `createBdd()`:
 *
 * ```typescript
 * import { test } from '../fixtures/bdd-fixtures';
 * import { createBdd } from 'playwright-bdd';
 *
 * const { Given, When, Then } = createBdd(test);
 * ```
 */
type BddFixtures = McpFixtures & {
    fieldScanner: PageFieldScanner;
};

export const test = base.extend<BddFixtures>({
    mcpRecorder: async ({ page }, use, testInfo) => {
        const recorder = new McpRecorder(page);
        await recorder.start();
        await use(recorder);

        const events = recorder.getEvents();
        if (events.length > 0) {
            const safeName = testInfo.title
                .replace(/[^a-zA-Z0-9]/g, '-')
                .replace(/-+/g, '-')
                .toLowerCase();
            await recorder.stop(`test-data/recordings/${safeName}.json`);
        }
    },

    fieldScanner: async ({ page }, use) => {
        const scanner = new PageFieldScanner(page);
        await use(scanner);
    },
});

export const { Given, When, Then, Before, After } = createBdd(test);
