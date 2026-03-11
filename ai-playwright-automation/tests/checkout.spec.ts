/*
 * AUTO-GENERATED STUB – AI Playwright Test Generation
 * =====================================================
 * File    : checkout.spec.ts
 * Source  : ../requirements/checkout.feature.md
 * Created : 2026-03-11T10:57:18.243Z
 *
 * HOW TO USE:
 * 1. Open this file in VS Code with GitHub Copilot enabled.
 * 2. Place your cursor at the END of this comment block (after the closing */).
 * 3. Press Tab or Alt+\ to trigger Copilot.
 * 4. Copilot will read the requirement below and generate 20–50 test cases.
 * 5. Review and adjust the generated tests for your application.
 *
 * PROMPT + REQUIREMENT:
 * ----------------------
 * # AI Prompt Template – Playwright Test Generation
 * 
 * ## How to use this prompt
 * 1. Run `node scripts/generate-tests.js --requirement requirements/<feature>.feature.md` to produce a stub `.spec.ts` file.
 * 2. Open the generated file in VS Code.
 * 3. Copy the prompt block below (or let the script embed it automatically) into the spec file as a comment.
 * 4. Place your cursor after the comment block and trigger **GitHub Copilot** (press `Tab` or `Alt+\`).
 * 5. Copilot reads the requirement embedded in the comment and generates 20–50 test cases automatically.
 * 
 * ---
 * 
 * ## Prompt (embed this in your `.spec.ts` file)
 * 
 * ```
 * You are a senior QA automation engineer with deep expertise in Playwright and TypeScript.
 * 
 * Convert the following requirement document into a complete Playwright test suite.
 * 
 * Rules:
 * - Use the Playwright test framework (@playwright/test).
 * - Generate both positive and negative test cases.
 * - Write clear, descriptive test titles that non-technical stakeholders can understand.
 * - Wrap related tests inside test.describe() blocks named after each Acceptance Criteria section.
 * - Cover every Acceptance Criteria listed in the requirement.
 * - Add separate test.describe('Edge Cases') block covering all edge cases.
 * - Use page.goto(), page.fill(), page.click(), page.locator(), and expect() from @playwright/test.
 * - Add a beforeEach() hook inside each describe block to navigate to the starting URL.
 * - Use the test data values provided in the requirement; do not invent data.
 * - Use async/await throughout; no callbacks.
 * - Export nothing – tests are self-contained.
 * - Target 20 to 50 individual test() cases in total.
 * - Add short inline comments above each test explaining what is being validated.
 * 
 * Requirement:
 * # Feature: Checkout
 * 
 * ## Description
 * Registered and guest users should be able to complete a purchase through the checkout flow.
 * 
 * ## Preconditions
 * - At least one product has been added to the shopping cart.
 * - User is either logged in or proceeding as a guest.
 * - Payment gateway sandbox is active.
 * 
 * ## Test Data
 * | Field            | Value                        |
 * |------------------|------------------------------|
 * | Valid Card       | 4111 1111 1111 1111          |
 * | Card Expiry      | 12/28 (MM/YY)                |
 * | CVV              | 123                          |
 * | Billing Name     | Test User                    |
 * | Billing Address  | 123 Test Street, Test City   |
 * | Invalid Card     | 0000 0000 0000 0000          |
 * | Expired Expiry   | 01/20                        |
 * 
 * ## Acceptance Criteria
 * 
 * ### AC1 – Successful checkout (logged-in user)
 * - Logged-in user proceeds to checkout with items in cart
 * - User enters valid shipping and payment details
 * - System processes the order and displays an order confirmation page with an order number
 * 
 * ### AC2 – Failed payment
 * - User enters invalid card details
 * - System displays a payment failure error message
 * - Cart contents are preserved after the failure
 * 
 * ### AC3 – Guest checkout
 * - Guest user proceeds to checkout
 * - User fills in email, shipping, and payment details
 * - System creates the order and sends a confirmation email to the provided address
 * 
 * ### AC4 – Empty cart
 * - User navigates directly to the checkout page with an empty cart
 * - System redirects the user back to the products page with an informational message
 * 
 * ## Edge Cases
 * - Applying an invalid or expired coupon code should display an appropriate error
 * - Removing the last item from the cart during checkout should redirect back to the shop
 * - Submitting checkout with missing required fields should show per-field validation errors
 * - Refreshing the payment page mid-checkout should not duplicate the order
 * - Very long shipping address strings should be handled gracefully
 * 
 * ```
 * 
 * ---
 * 
 * ## Example output structure
 * 
 * ```typescript
 * import { test, expect } from '@playwright/test';
 * 
 * test.describe('Feature: User Login', () => {
 * 
 *   test.describe('AC1 – Valid login', () => {
 *     test.beforeEach(async ({ page }) => {
 *       await page.goto('/login');
 *     });
 * 
 *     // Valid credentials should redirect to /dashboard
 *     test('should redirect to dashboard on valid credentials', async ({ page }) => {
 *       await page.fill('#email', 'user@test.com');
 *       await page.fill('#password', 'password123');
 *       await page.click('#login');
 *       await expect(page).toHaveURL('/dashboard');
 *     });
 *   });
 * 
 *   test.describe('AC2 – Invalid password', () => {
 *     // ...more tests generated by Copilot
 *   });
 * 
 *   test.describe('Edge Cases', () => {
 *     // ...edge case tests generated by Copilot
 *   });
 * });
 * ```
 * 
 */

import { test, expect } from '@playwright/test';

// GitHub Copilot: please generate the full test suite based on the
// requirement and rules described in the comment block above.
// Start with a test.describe block named after the feature.
