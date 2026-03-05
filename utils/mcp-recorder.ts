import { Page, test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LocatorStrategyResolver } from './locator-strategy';

/**
 * A single interaction event captured during a test run.
 */
export interface RecordedEvent {
    /** Sequential step number */
    step: number;
    /** Type of interaction */
    action: 'fill' | 'click' | 'select' | 'check' | 'uncheck' | 'navigate' | 'press' | 'custom';
    /** Best unique locator expression for the target element */
    locatorExpression: string;
    /** Strategy used */
    locatorStrategy: string;
    /** Whether the locator is confirmed unique */
    isUnique: boolean;
    /** Value entered / selected (for fill / select actions) */
    value?: string;
    /** URL at the time of the event */
    url: string;
    /** ISO timestamp */
    timestamp: string;
}

/**
 * Summary output written when {@link McpRecorder.stop} is called.
 */
export interface RecordingSession {
    sessionId: string;
    startedAt: string;
    endedAt: string;
    events: RecordedEvent[];
}

/**
 * MCP-compatible interaction recorder.
 *
 * Wraps Playwright `page` events to capture every user interaction during a
 * test run and stores it as structured JSON that can be replayed with different
 * data sets (data-driven testing).
 *
 * ### Usage inside a Playwright test
 * ```typescript
 * import { McpRecorder } from '../utils/mcp-recorder';
 *
 * test('record login flow', async ({ page }) => {
 *   const recorder = new McpRecorder(page);
 *   await recorder.start();
 *
 *   // … your test actions …
 *   await recorder.recordFill(page.getByLabel('Username'), 'admin');
 *   await recorder.recordFill(page.getByLabel('Password'), 'secret');
 *   await recorder.recordClick(page.getByRole('button', { name: 'Login' }));
 *
 *   await recorder.stop('test-data/recorded-login.json');
 * });
 * ```
 *
 * ### Usage inside a BDD step
 * ```typescript
 * Given('I fill {string} with {string}', async ({ page }, fieldLabel, value) => {
 *   const recorder = McpRecorder.getInstance(page);
 *   await recorder.recordFill(page.getByLabel(fieldLabel), value);
 * });
 * ```
 */
export class McpRecorder {
    private events: RecordedEvent[] = [];
    private stepCounter = 0;
    private startedAt = '';
    private readonly resolver: LocatorStrategyResolver;
    private navigationListener: ((frame: import('@playwright/test').Frame) => void) | null = null;

    /** Singleton map so BDD steps can share the same recorder instance per page */
    private static instances = new WeakMap<Page, McpRecorder>();

    constructor(private readonly page: Page) {
        this.resolver = new LocatorStrategyResolver(page);
    }

    /** Get or create the shared recorder for a given page. */
    static getInstance(page: Page): McpRecorder {
        if (!McpRecorder.instances.has(page)) {
            McpRecorder.instances.set(page, new McpRecorder(page));
        }
        return McpRecorder.instances.get(page)!;
    }

    /** Start the recording session. Call once before the first interaction. */
    async start(): Promise<void> {
        this.startedAt = new Date().toISOString();
        this.events = [];
        this.stepCounter = 0;

        // Remove any previously registered listener before adding a new one
        if (this.navigationListener) {
            this.page.off('framenavigated', this.navigationListener);
        }

        // Automatically capture navigation events
        this.navigationListener = (frame) => {
            if (frame === this.page.mainFrame()) {
                this.addEvent({
                    action: 'navigate',
                    locatorExpression: '',
                    locatorStrategy: 'navigate',
                    isUnique: true,
                    url: frame.url(),
                });
            }
        };
        this.page.on('framenavigated', this.navigationListener);
    }

    /**
     * Record a fill action on an input / textarea.
     *
     * @param locator  Playwright Locator targeting the field.
     * @param value    Text to fill in.
     */
    async recordFill(
        locator: ReturnType<Page['locator']>,
        value: string,
    ): Promise<void> {
        const resolved = await this.resolver.resolve(locator);
        await locator.fill(value);
        this.addEvent({
            action: 'fill',
            locatorExpression: resolved.expression,
            locatorStrategy: resolved.strategy,
            isUnique: resolved.isUnique,
            value,
            url: this.page.url(),
        });
    }

    /**
     * Record a click action on any element.
     *
     * @param locator Playwright Locator targeting the element.
     */
    async recordClick(
        locator: ReturnType<Page['locator']>,
    ): Promise<void> {
        const resolved = await this.resolver.resolve(locator);
        await locator.click();
        this.addEvent({
            action: 'click',
            locatorExpression: resolved.expression,
            locatorStrategy: resolved.strategy,
            isUnique: resolved.isUnique,
            url: this.page.url(),
        });
    }

    /**
     * Record a select-option action on a <select> element.
     *
     * @param locator Playwright Locator targeting the <select>.
     * @param value   Option value or label to select.
     */
    async recordSelect(
        locator: ReturnType<Page['locator']>,
        value: string,
    ): Promise<void> {
        const resolved = await this.resolver.resolve(locator);
        await locator.selectOption(value);
        this.addEvent({
            action: 'select',
            locatorExpression: resolved.expression,
            locatorStrategy: resolved.strategy,
            isUnique: resolved.isUnique,
            value,
            url: this.page.url(),
        });
    }

    /**
     * Record a check / uncheck action on a checkbox or radio button.
     *
     * @param locator Playwright Locator targeting the checkbox.
     * @param check   `true` to check, `false` to uncheck.
     */
    async recordCheck(
        locator: ReturnType<Page['locator']>,
        check: boolean,
    ): Promise<void> {
        const resolved = await this.resolver.resolve(locator);
        if (check) {
            await locator.check();
        } else {
            await locator.uncheck();
        }
        this.addEvent({
            action: check ? 'check' : 'uncheck',
            locatorExpression: resolved.expression,
            locatorStrategy: resolved.strategy,
            isUnique: resolved.isUnique,
            value: String(check),
            url: this.page.url(),
        });
    }

    /**
     * Append a custom / arbitrary event to the recording.
     * Useful for capturing assertions or business-level milestones.
     *
     * @param label  Short label for the event.
     * @param value  Optional value to associate with the event.
     */
    async recordCustom(label: string, value?: string): Promise<void> {
        this.addEvent({
            action: 'custom',
            locatorExpression: label,
            locatorStrategy: 'custom',
            isUnique: true,
            value,
            url: this.page.url(),
        });
    }

    /**
     * Stop the recording and persist the session to a JSON file.
     *
     * @param outputPath  Path for the session JSON (relative or absolute).
     * @returns The completed {@link RecordingSession}.
     */
    async stop(outputPath: string): Promise<RecordingSession> {
        // Remove the navigation listener to prevent memory leaks
        if (this.navigationListener) {
            this.page.off('framenavigated', this.navigationListener);
            this.navigationListener = null;
        }

        const session: RecordingSession = {
            sessionId: `session-${Date.now()}`,
            startedAt: this.startedAt,
            endedAt: new Date().toISOString(),
            events: this.events,
        };

        const resolved = path.isAbsolute(outputPath)
            ? outputPath
            : path.resolve(process.cwd(), outputPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, JSON.stringify(session, null, 2), 'utf-8');
        console.log(`[McpRecorder] Session saved → ${resolved} (${this.events.length} events)`);

        return session;
    }

    /**
     * Return recorded events without writing to disk.
     */
    getEvents(): ReadonlyArray<RecordedEvent> {
        return this.events;
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private addEvent(
        partial: Omit<RecordedEvent, 'step' | 'timestamp'>,
    ): void {
        this.events.push({
            step: ++this.stepCounter,
            timestamp: new Date().toISOString(),
            ...partial,
        });
    }
}

// ── Playwright fixture extension ─────────────────────────────────────────────

/**
 * Custom fixtures that add `mcpRecorder` and `fieldScanner` to every test.
 *
 * Use this when you want the recorder to be wired up automatically:
 * ```typescript
 * // tests/my-feature.spec.ts
 * import { test, expect } from '../fixtures/mcp-fixtures';
 *
 * test('record login', async ({ page, mcpRecorder }) => {
 *   await mcpRecorder.recordFill(page.getByLabel('Email'), 'user@example.com');
 *   await mcpRecorder.recordClick(page.getByRole('button', { name: 'Login' }));
 * });
 * ```
 */
export type McpFixtures = {
    mcpRecorder: McpRecorder;
};

export const test = base.extend<McpFixtures>({
    mcpRecorder: async ({ page }, use, testInfo) => {
        const recorder = new McpRecorder(page);
        await recorder.start();
        await use(recorder);
        // Auto-save recording if the test produced events
        const events = recorder.getEvents();
        if (events.length > 0) {
            const safeName = testInfo.title
                .replace(/[^a-zA-Z0-9]/g, '-')
                .replace(/-+/g, '-')
                .toLowerCase();
            await recorder.stop(`test-data/recordings/${safeName}.json`);
        }
    },
});
