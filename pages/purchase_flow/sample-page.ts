import { Page } from '@playwright/test';

/**
 * Sample Page Object Template
 * Replace this with your actual page object
 * Delete this file once you have your own page objects
 */
export class SampleFlowPage {
    private page: Page;

    // Add your locators here
    // private readonly elementLocator = '#element-id';

    constructor(page: Page) {
        this.page = page;
    }

    // Add your page methods here
    // async performAction() {
    //     await this.page.click(this.elementLocator);
    // }
}
