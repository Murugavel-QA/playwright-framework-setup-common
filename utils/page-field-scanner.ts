import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { LocatorStrategyResolver } from './locator-strategy';

/**
 * Metadata captured for a single interactive element on the page.
 */
export interface PageField {
    /** Human-readable field label or accessible name */
    label: string;
    /** Best unique locator expression */
    locatorExpression: string;
    /** Strategy used to derive the locator */
    locatorStrategy: string;
    /** Whether the locator is confirmed unique on the page */
    isUnique: boolean;
    /** HTML tag name of the element */
    tagName: string;
    /** Input type (for <input> elements) */
    inputType: string;
    /** Element id attribute */
    id: string;
    /** Element name attribute */
    name: string;
    /** Placeholder text */
    placeholder: string;
    /** Visible text content */
    textContent: string;
    /** Suggested Page Object property name (camelCase) */
    pomPropertyName: string;
}

/**
 * Result produced by a single page scan.
 */
export interface ScanResult {
    url: string;
    scannedAt: string;
    fields: PageField[];
}

/**
 * Scans a running Playwright page for all interactive elements and extracts:
 *  - Unique locators using {@link LocatorStrategyResolver}
 *  - Suggested POM property names
 *  - JSON report of all discovered fields
 *  - Auto-generated TypeScript Page Object class skeleton
 *
 * ### Typical usage inside a Playwright test / step:
 * ```typescript
 * const scanner = new PageFieldScanner(page);
 * const result  = await scanner.scan();
 * await scanner.saveScanReport(result, 'test-data/login-page-scan.json');
 * await scanner.generatePageObject(result, 'pages/login_homepage/login-page.ts', 'LoginPage');
 * ```
 */
export class PageFieldScanner {
    private readonly resolver: LocatorStrategyResolver;

    constructor(private readonly page: Page) {
        this.resolver = new LocatorStrategyResolver(page);
    }

    /**
     * Scan the current page for all interactive elements.
     * @returns A {@link ScanResult} containing metadata for every field found.
     */
    async scan(): Promise<ScanResult> {
        const url = this.page.url();

        // Collect all interactive elements: inputs, selects, textareas, buttons, links, checkboxes
        const selectors = [
            'input:not([type="hidden"])',
            'select',
            'textarea',
            'button',
            'a[href]',
            '[role="button"]',
            '[role="checkbox"]',
            '[role="radio"]',
            '[role="combobox"]',
            '[role="textbox"]',
            '[role="searchbox"]',
            '[role="spinbutton"]',
            '[role="switch"]',
            '[role="listbox"]',
            '[role="option"]',
            '[role="menuitem"]',
            '[role="tab"]',
        ].join(', ');

        const elements = await this.page.locator(selectors).all();
        const fields: PageField[] = [];
        const seenPomNames = new Set<string>();

        for (const el of elements) {
            try {
                const attrs = await el.evaluate((node: Element) => {
                    const input = node as HTMLInputElement;
                    const label = (() => {
                        const id = node.getAttribute('id');
                        if (id) {
                            const lbl = document.querySelector(`label[for="${id}"]`);
                            if (lbl?.textContent) return lbl.textContent.trim();
                        }
                        const wrap = node.closest('label');
                        if (wrap?.textContent) return wrap.textContent.trim();
                        return (
                            node.getAttribute('aria-label') ??
                            node.getAttribute('placeholder') ??
                            (node.textContent ?? '').trim().slice(0, 60) ??
                            node.getAttribute('name') ??
                            node.getAttribute('id') ??
                            ''
                        );
                    })();

                    return {
                        label,
                        tagName: node.tagName.toLowerCase(),
                        inputType: input.type ?? '',
                        id: node.getAttribute('id') ?? '',
                        name: input.name ?? '',
                        placeholder: input.placeholder ?? '',
                        textContent: (node.textContent ?? '').trim().slice(0, 60),
                    };
                });

                // Skip purely invisible or empty submit/reset buttons
                if (!attrs.label && !attrs.name && !attrs.id && !attrs.placeholder) {
                    continue;
                }

                const resolved = await this.resolver.resolve(el);

                const rawName = attrs.label || attrs.name || attrs.id || attrs.placeholder || attrs.tagName;
                const pomPropertyName = this.uniquePomName(
                    this.toCamelCase(rawName),
                    seenPomNames,
                );
                seenPomNames.add(pomPropertyName);

                fields.push({
                    label: attrs.label,
                    locatorExpression: resolved.expression,
                    locatorStrategy: resolved.strategy,
                    isUnique: resolved.isUnique,
                    tagName: attrs.tagName,
                    inputType: attrs.inputType,
                    id: attrs.id,
                    name: attrs.name,
                    placeholder: attrs.placeholder,
                    textContent: attrs.textContent,
                    pomPropertyName,
                });
            } catch {
                // Element may have been removed from the DOM; skip it
            }
        }

        return {
            url,
            scannedAt: new Date().toISOString(),
            fields,
        };
    }

    /**
     * Save the scan result as a JSON file.
     *
     * @param result    Scan result from {@link scan}.
     * @param outputPath Path for the JSON file (relative to project root or absolute).
     */
    async saveScanReport(result: ScanResult, outputPath: string): Promise<void> {
        const resolved = path.isAbsolute(outputPath)
            ? outputPath
            : path.resolve(process.cwd(), outputPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, JSON.stringify(result, null, 2), 'utf-8');
        console.log(`[PageFieldScanner] Scan report saved → ${resolved}`);
    }

    /**
     * Generate a TypeScript Page Object class skeleton from a scan result and
     * write it to disk.
     *
     * @param result      Scan result from {@link scan}.
     * @param outputPath  Path for the generated `.ts` file.
     * @param className   Name of the generated class (e.g. `LoginPage`).
     */
    async generatePageObject(
        result: ScanResult,
        outputPath: string,
        className: string,
    ): Promise<void> {
        const resolved = path.isAbsolute(outputPath)
            ? outputPath
            : path.resolve(process.cwd(), outputPath);
        fs.mkdirSync(path.dirname(resolved), { recursive: true });

        const locatorLines = result.fields
            .map(
                (f) =>
                    `    /** ${this.sanitizeJsDoc(f.label || f.pomPropertyName)} — strategy: ${f.locatorStrategy}${f.isUnique ? '' : ' (⚠ may not be unique)'} */\n` +
                    `    private readonly ${f.pomPropertyName} = ${f.locatorExpression.replace('page.', 'this.page.')};`,
            )
            .join('\n\n');

        const methodLines = result.fields
            .filter((f) => ['input', 'textarea', 'select'].includes(f.tagName))
            .map(
                (f) =>
                    `    async fill${this.capitalize(f.pomPropertyName)}(value: string): Promise<void> {\n` +
                    `        await this.${f.pomPropertyName}.fill(value);\n` +
                    `    }`,
            )
            .join('\n\n');

        const clickLines = result.fields
            .filter(
                (f) =>
                    ['button', 'a'].includes(f.tagName) ||
                    ['submit', 'button', 'reset'].includes(f.inputType),
            )
            .map(
                (f) =>
                    `    async click${this.capitalize(f.pomPropertyName)}(): Promise<void> {\n` +
                    `        await this.${f.pomPropertyName}.click();\n` +
                    `    }`,
            )
            .join('\n\n');

        const content = [
            `// Auto-generated by PageFieldScanner on ${result.scannedAt}`,
            `// Source URL: ${result.url}`,
            `// ⚠  Review and adjust locators marked as "may not be unique" before committing.`,
            `import { Page } from '@playwright/test';`,
            ``,
            `export class ${className} {`,
            `    constructor(private readonly page: Page) {}`,
            ``,
            locatorLines,
            ``,
            methodLines,
            ``,
            clickLines,
            `}`,
            ``,
        ].join('\n');

        fs.writeFileSync(resolved, content, 'utf-8');
        console.log(`[PageFieldScanner] Page object generated → ${resolved}`);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private toCamelCase(text: string): string {
        return text
            .replace(/[^a-zA-Z0-9 _-]/g, ' ')
            .trim()
            .split(/[\s_-]+/)
            .map((word, i) =>
                i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
            )
            .join('');
    }

    private capitalize(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    private uniquePomName(base: string, seen: Set<string>): string {
        if (!seen.has(base)) return base;
        let counter = 2;
        while (seen.has(`${base}${counter}`)) counter++;
        return `${base}${counter}`;
    }

    /** Escape sequences that would close a JSDoc comment (`* /`). */
    private sanitizeJsDoc(text: string): string {
        return text.replace(/\*\//g, '* /');
    }
}
