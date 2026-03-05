import { Locator, Page } from '@playwright/test';

/**
 * Priority order used when selecting the best unique locator for an element.
 * Lower index = higher priority.
 */
export type LocatorStrategy =
    | 'data-testid'
    | 'data-test'
    | 'data-qa'
    | 'data-cy'
    | 'aria-label'
    | 'id'
    | 'name'
    | 'role+name'
    | 'placeholder'
    | 'label-text'
    | 'text'
    | 'css';

export interface LocatorResult {
    /** The strategy that produced this locator */
    strategy: LocatorStrategy;
    /** Playwright locator expression (e.g. `page.getByRole('button', { name: 'Submit' })`) */
    expression: string;
    /** Whether this locator was confirmed unique on the page */
    isUnique: boolean;
    /** The Playwright Locator object */
    locator: Locator;
}

/**
 * Utility that derives the best unique Playwright locator for a given element.
 *
 * Resolution order (highest → lowest priority):
 *  1. data-testid / data-test / data-qa / data-cy
 *  2. aria-label
 *  3. unique id
 *  4. getByRole + accessible name
 *  5. placeholder text
 *  6. associated <label> text
 *  7. visible text content (for buttons/links)
 *  8. CSS selector (fallback)
 *
 * Usage:
 *   const strategy = new LocatorStrategyResolver(page);
 *   const result = await strategy.resolve(element);
 *   console.log(result.expression);  // e.g. page.getByTestId('username')
 */
export class LocatorStrategyResolver {
    constructor(private readonly page: Page) {}

    /**
     * Resolve the best unique locator for the given element handle.
     * Iterates through the priority list and returns the first unique match.
     */
    async resolve(elementHandle: Locator): Promise<LocatorResult> {
        // Retrieve attributes from the element
        const attrs = await elementHandle.evaluate((el: Element) => {
            const inputEl = el as HTMLInputElement;
            return {
                dataTestId: el.getAttribute('data-testid') ?? '',
                dataTest: el.getAttribute('data-test') ?? '',
                dataQa: el.getAttribute('data-qa') ?? '',
                dataCy: el.getAttribute('data-cy') ?? '',
                ariaLabel: el.getAttribute('aria-label') ?? '',
                id: el.getAttribute('id') ?? '',
                name: (el as HTMLInputElement).name ?? '',
                placeholder: inputEl.placeholder ?? '',
                tagName: el.tagName.toLowerCase(),
                role: el.getAttribute('role') ?? '',
                type: inputEl.type ?? '',
                textContent: (el.textContent ?? '').trim(),
            };
        });

        const candidates: Array<[LocatorStrategy, Locator, string]> = [];

        if (attrs.dataTestId) {
            candidates.push([
                'data-testid',
                this.page.getByTestId(attrs.dataTestId),
                `page.getByTestId('${attrs.dataTestId}')`,
            ]);
        }
        if (attrs.dataTest) {
            candidates.push([
                'data-test',
                this.page.locator(`[data-test="${attrs.dataTest}"]`),
                `page.locator('[data-test="${attrs.dataTest}"]')`,
            ]);
        }
        if (attrs.dataQa) {
            candidates.push([
                'data-qa',
                this.page.locator(`[data-qa="${attrs.dataQa}"]`),
                `page.locator('[data-qa="${attrs.dataQa}"]')`,
            ]);
        }
        if (attrs.dataCy) {
            candidates.push([
                'data-cy',
                this.page.locator(`[data-cy="${attrs.dataCy}"]`),
                `page.locator('[data-cy="${attrs.dataCy}"]')`,
            ]);
        }
        if (attrs.ariaLabel) {
            candidates.push([
                'aria-label',
                this.page.locator(`[aria-label="${attrs.ariaLabel}"]`),
                `page.locator('[aria-label="${attrs.ariaLabel}"]')`,
            ]);
        }
        if (attrs.id) {
            const escapedId = attrs.id.replace(/([!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g, '\\$1');
            candidates.push([
                'id',
                this.page.locator(`#${escapedId}`),
                `page.locator('#${escapedId}')`,
            ]);
        }

        // getByRole with accessible name
        const ariaRole = this.inferAriaRole(attrs.tagName, attrs.role, attrs.type);
        const accessibleName = attrs.ariaLabel || attrs.textContent;
        if (ariaRole && accessibleName) {
            candidates.push([
                'role+name',
                this.page.getByRole(ariaRole as Parameters<Page['getByRole']>[0], {
                    name: accessibleName,
                }),
                `page.getByRole('${ariaRole}', { name: '${this.escapeQuote(accessibleName)}' })`,
            ]);
        }

        if (attrs.placeholder) {
            candidates.push([
                'placeholder',
                this.page.getByPlaceholder(attrs.placeholder),
                `page.getByPlaceholder('${this.escapeQuote(attrs.placeholder)}')`,
            ]);
        }

        // Visible text (for buttons, links, headings)
        const textRoles = ['button', 'link', 'menuitem', 'option', 'tab'];
        if (ariaRole && textRoles.includes(ariaRole) && attrs.textContent) {
            candidates.push([
                'text',
                this.page.getByText(attrs.textContent, { exact: true }),
                `page.getByText('${this.escapeQuote(attrs.textContent)}', { exact: true })`,
            ]);
        }

        // Label-text (for labeled inputs)
        if (['input', 'select', 'textarea'].includes(attrs.tagName)) {
            const labelText = await this.findLabelText(elementHandle);
            if (labelText) {
                candidates.push([
                    'label-text',
                    this.page.getByLabel(labelText),
                    `page.getByLabel('${this.escapeQuote(labelText)}')`,
                ]);
            }
        }

        // CSS fallback
        const cssSelector = await this.buildCssSelector(elementHandle);
        candidates.push([
            'css',
            this.page.locator(cssSelector),
            `page.locator('${cssSelector}')`,
        ]);

        // Return the first candidate that is unique on the page
        for (const [strategy, locator, expression] of candidates) {
            const count = await locator.count().catch(() => -1);
            if (count === 1) {
                return { strategy, expression, isUnique: true, locator };
            }
        }

        // If nothing is unique, return the highest-priority candidate anyway
        const [strategy, locator, expression] = candidates[0];
        return { strategy, expression, isUnique: false, locator };
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private inferAriaRole(
        tagName: string,
        explicitRole: string,
        inputType: string,
    ): string | null {
        if (explicitRole) return explicitRole;
        const map: Record<string, string> = {
            a: 'link',
            button: 'button',
            select: 'combobox',
            textarea: 'textbox',
            h1: 'heading',
            h2: 'heading',
            h3: 'heading',
        };
        if (tagName === 'input') {
            const inputRoles: Record<string, string> = {
                checkbox: 'checkbox',
                radio: 'radio',
                submit: 'button',
                reset: 'button',
                button: 'button',
                search: 'searchbox',
            };
            return inputRoles[inputType] ?? 'textbox';
        }
        return map[tagName] ?? null;
    }

    private async findLabelText(elementHandle: Locator): Promise<string | null> {
        return elementHandle.evaluate((el: Element) => {
            // Check for explicit label via `for` attribute
            const id = el.getAttribute('id');
            if (id) {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label?.textContent) return label.textContent.trim();
            }
            // Check for wrapping label
            const closest = el.closest('label');
            if (closest?.textContent) return closest.textContent.trim();
            return null;
        });
    }

    private async buildCssSelector(elementHandle: Locator): Promise<string> {
        return elementHandle.evaluate((el: Element) => {
            const parts: string[] = [];
            let current: Element | null = el;
            while (current && current.tagName !== 'BODY') {
                let part = current.tagName.toLowerCase();
                if (current.id) {
                    part += `#${current.id}`;
                    parts.unshift(part);
                    break;
                }
                const siblings = Array.from(current.parentElement?.children ?? []).filter(
                    (c) => (c as Element).tagName === current!.tagName,
                );
                if (siblings.length > 1) {
                    const idx = siblings.indexOf(current) + 1;
                    part += `:nth-of-type(${idx})`;
                }
                parts.unshift(part);
                current = current.parentElement;
            }
            return parts.join(' > ');
        });
    }

    /** Escape backslashes and single quotes so the text is safe inside a single-quoted JS string. */
    private escapeQuote(text: string): string {
        return text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }
}
