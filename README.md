# Playwright BDD Test Automation Framework

## 📋 Table of Contents
- [Overview](#overview)
- [Framework Architecture](#framework-architecture)
- [Directory Structure](#directory-structure)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Quick Start Guide](#quick-start-guide)
- [MCP Integration](#-mcp-integration-auto-scrape-screen-fields)
- [Best Practices](#best-practices)
- [Cloning for New Projects](#cloning-for-new-projects)

---

## 🎯 Overview

This is a **clean, reusable Playwright BDD Test Automation Framework structure** ready to clone for any automation project. The framework provides a complete folder structure with all necessary configurations pre-setup.

### Key Features
- ✅ **BDD with Gherkin**: Ready for human-readable feature files
- ✅ **Page Object Model**: Structured folders for page objects
- ✅ **TypeScript**: Pre-configured with type safety
- ✅ **Excel Data Management**: Built-in Excel reader utility (`data-utils/excel-data-reader.ts`)
- ✅ **Allure Reporting**: HTML and Allure reporting configured
- ✅ **Modular Architecture**: Clean folder structure
- ✅ **Zero Boilerplate**: Empty folders ready for your code
- ✅ **Production Ready**: All configurations and dependencies included
- ✅ **MCP Integration**: `@playwright/mcp` server for AI-assisted browser control
- ✅ **Auto Page Scanner**: Automatically discovers all screen fields with unique locators
- ✅ **Interaction Recorder**: Records test runs and exports data-driven JSON for replay
- ✅ **Locator Strategy**: Smart locator resolution (data-testid → aria → id → role → placeholder → CSS)

---

## 🏗️ Framework Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Feature Files (.feature)               │
│              (Gherkin - Business Readable)               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    Step Definitions                      │
│             (Glue code connecting features               │
│                  to Page Objects)                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   Page Objects                           │
│          (UI Element Locators & Actions)                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   Test Data Layer                        │
│           (Excel Files + Type Definitions)               │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
Playwright-Framework/
│
├── 📂 config/                       # Configuration files
│   └── playwright.config.ts        # Additional Playwright configs
│
├── 📂 data-utils/                   # Data utility functions
│   └── excel-data-reader.ts        # Excel data reader utility
│
├── 📂 features/                     # Gherkin feature files (BDD scenarios)
│   └── (empty - add your .feature files here)
│
├── 📂 steps/                        # Step definitions (Glue code)
│   └── (empty - add your step definitions here)
│
├── 📂 pages/                        # Page Object Model classes
│   ├── 📂 login_homepage/          # Login and homepage pages
│   │   └── (empty - add your page objects here)
│   │
│   └── 📂 purchase_flow/            # Application flow pages
│       └── (empty - add your page objects here)
│
├── 📂 test-data/                    # Test data files (JSON/TS)
│   └── (empty - add your test data files here)
│
├── 📂 test-data-excel/              # Excel test data files
│   └── (empty - add your Excel files here)
│
├── 📂 types/                        # TypeScript type definitions
│   └── (empty - add your type definitions here)
│
├── 📂 tests/                        # Playwright test files (non-BDD)
│   └── (empty - add your test files here)
│
├── 📂 tests-examples/               # Example/demo tests
│   └── (empty - add example tests here)
│
├── 📂 Uploadfiles/                  # Files for upload testing
│   └── (empty - add files for upload tests here)
│
├── 📂 html-report/                  # HTML test reports (auto-generated)
├── 📂 temp-report/                  # Temporary reports (auto-generated)
│
├── .gitignore                       # Git ignore configuration
├── playwright.config.ts             # Main Playwright configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # NPM dependencies
└── README.md                        # This file
```
│   └── .gitkeep                    # Add files to upload here
│
├── 📂 html-report/                  # HTML test reports (auto-generated)
├── 📂 temp-report/                  # Temporary reports (auto-generated)
│
├── playwright.config.ts             # Main Playwright configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # NPM dependencies
└── README.md                        # This file
```

---

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation Steps

1. **Clone this framework repository**
   ```bash
   git clone https://github.com/Murugavel-QA/Playwright-framework-setup.git
   cd Playwright-framework-setup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

4. **Verify installation**
   ```bash
   npm test
   ```

---

## ⚙️ Configuration

The framework uses [playwright.config.ts](playwright.config.ts) for main configuration:

- **Test directory**: BDD features and step definitions
- **Parallel execution**: Configurable (default: false for sequential)
- **Reporters**: HTML and Allure
- **Timeouts**: 90s for actions, navigation, and tests
- **Browser options**: Chromium (headed mode)
- **Screenshots**: On failure
- **Base URL**: Configure in config file

---

## 🎯 Quick Start Guide

### 1. Clone for Your Project

```bash
git clone https://github.com/Murugavel-QA/Playwright-framework-setup.git my-project-automation
cd my-project-automation
rm -rf .git  # Remove framework git history
git init     # Initialize new git for your project
npm install
```

### 2. Update Configuration

Edit [playwright.config.ts](playwright.config.ts):
```typescript
use: {
    baseURL: 'https://your-application-url.com',
    // ... other settings
}
```

### 3. Create Your First Test

**a) Create a Feature File** in [features/](features/):
```gherkin
Feature: My Application Login

  Scenario: Successful login
    Given I navigate to the login page
    When I login with valid credentials
    Then I should be logged in successfully
```

# features/login.feature
Feature: My Application Login

  Scenario: Successful login
    Given I navigate to the login page
    When I login with valid credentials
    Then I should be logged in successfully
```

**b) Create a Page Object** in [pages/login_homepage/](pages/login_homepage/):
```typescript
// pages/login_homepage/login-page.ts
import { Page } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    async navigateToLogin() {
        await this.page.goto('/login');
    }

    async login(username: string, password: string) {
        await this.page.fill('#username', username);
    playwright test --grep "@smoke"

# Run with specific browser
npx playwright test --project=chromium

# Generate Allure report
npm run allure:generate
npm run allure:open
```

---

## 📦 Framework Components

### Sample Files Included

The framework includes complete sample implementations:

1. **Page Objects** ([pages/](pages/))
   - [login-page.ts](pages/login_homepage/login-page.ts) - Login page template
   - [homepage-page.ts](pages/login_homepage/homepage-page.ts) - Homepage template
   - [sample-page.ts](pages/purchase_flow/sample-page.ts) - Generic page template

2. **Step Definitions** ([steps/](steps/))
   - [login-steps.ts](steps/login-steps.ts) - Login steps
   - [homepage-steps.ts](steps/homepage-steps.ts) - Homepage steps
   - [sample-steps.ts](steps/sample-steps.ts) - Template for new steps

3. **Feature Files** ([features/](features/))
   - [sample-login.feature](features/sample-login.feature) - Login scenarios with examples
   - [sample-homepage.feature](features/sample-homepage.feature) - Navigation scenarios

4. **Test Data** ([test-data/](test-data/))
   - [login-data.json](test-data/login-data.json) - Sample login data
   - [homepage-data.json](test-data/homepage-data.json) - Sample homepage data
   - [sample-data.json](test-data/sample-data.json) - Generic data template

5. **Type Definitions** ([types/](types/))
   - [login-data.ts](types/login-data.ts) - Login types
   - [homepage-data.ts](types/homepage-data.ts) - Homepage types
   - [sample-data.ts](types/sample-data.ts) - Template types with examples

### How to Use Templates

1. **Copy** a sample file (e.g., `sample-page.ts`)
2. **Rename** it for your feature (e.g., `user-profile-page.ts`)
3. **Update** selectors and methods for your application
4. **Delete** sample files once you have your own tests

---

## 🤖 MCP Integration — Auto-Scrape Screen Fields

### What is MCP?

**Model Context Protocol (MCP)** lets AI assistants (Claude, Copilot, etc.) take control of a
real Chromium browser via `@playwright/mcp`.  Inside this framework it also powers two utility
classes that solve two key problems:

| Problem | Solution |
|---|---|
| Codegen records static locators that break with new data | **`LocatorStrategyResolver`** — picks the most unique, stable locator at runtime |
| Codegen can't run the same flow with different inputs | **`McpRecorder`** — captures every interaction as JSON → rerun with any data |
| Manually finding all fields on 20 screens is slow | **`PageFieldScanner`** — scans every interactive element and generates a POM skeleton |

---

### New files added

| File | Purpose |
|---|---|
| `playwright.config.ts` | Main Playwright + BDD configuration |
| `data-utils/excel-data-reader.ts` | Read test data from Excel `.xlsx` files |
| `utils/locator-strategy.ts` | `LocatorStrategyResolver` — unique locator priority engine |
| `utils/page-field-scanner.ts` | `PageFieldScanner` — auto-scan pages → JSON report + POM skeleton |
| `utils/mcp-recorder.ts` | `McpRecorder` — record interactions → replayable JSON sessions |
| `fixtures/bdd-fixtures.ts` | BDD fixtures that inject `mcpRecorder` and `fieldScanner` |
| `.mcp.json` | MCP server configuration for `@playwright/mcp` |

---

### Step 1 — Start the MCP server (AI-assisted mode)

```bash
npm run mcp
# or
npx @playwright/mcp@latest
```

Once running, connect your AI assistant (e.g. Claude Desktop, GitHub Copilot in VS Code).
The assistant can then navigate, fill forms, click buttons, and read the DOM — all through
the MCP protocol.

---

### Step 2 — Auto-scan a screen and generate a Page Object

```typescript
// tests/scan-my-screen.spec.ts
import { test } from '@playwright/test';
import { PageFieldScanner } from '../utils/page-field-scanner';

test('scan login page and generate POM', async ({ page }) => {
    await page.goto('https://your-app.com/login');

    const scanner = new PageFieldScanner(page);
    const result  = await scanner.scan();

    // Save the JSON report (shows every field + chosen locator)
    await scanner.saveScanReport(result, 'test-data/login-scan.json');

    // Auto-generate a TypeScript Page Object skeleton
    await scanner.generatePageObject(
        result,
        'pages/login_homepage/login-page.ts',
        'LoginPage',
    );
});
```

The generated `login-page.ts` will contain ready-to-use locators for every field on the screen,
with stable selectors chosen by `LocatorStrategyResolver` in priority order:

1. `data-testid`
2. `data-test` / `data-qa` / `data-cy`
3. `aria-label`
4. Unique `id`
5. `getByRole` + accessible name
6. `getByPlaceholder`
7. Associated `<label>` text
8. Visible text (buttons/links)
9. CSS selector (fallback)

---

### Step 3 — Record a test run for data-driven replay

```typescript
// steps/login-steps.ts
import { Given, When, Then } from '../fixtures/bdd-fixtures';

Given('I am on the login page', async ({ page }) => {
    await page.goto('/login');
});

When('I login with {string} and {string}', async ({ page, mcpRecorder }, email, password) => {
    await mcpRecorder.recordFill(page.getByLabel('Email'), email);
    await mcpRecorder.recordFill(page.getByLabel('Password'), password);
    await mcpRecorder.recordClick(page.getByRole('button', { name: 'Sign In' }));
});

Then('I should be on the dashboard', async ({ page }) => {
    await page.waitForURL('**/dashboard');
});
```

The `mcpRecorder` fixture auto-saves a JSON file to `test-data/recordings/` after each test.

---

### Step 4 — Data-driven testing with Scenario Outline

Because the recorder separates **locators** from **values**, you can replay the same flow with
different data sets using Gherkin `Scenario Outline`:

```gherkin
Feature: Login — data-driven

  Scenario Outline: Login with different user roles
    Given I am on the login page
    When I login with "<email>" and "<password>"
    Then I should be on the dashboard

    Examples:
      | email                  | password   |
      | admin@example.com      | Admin@123  |
      | manager@example.com    | Mgr@456    |
      | viewer@example.com     | View@789   |
```

Or load data from Excel:

```typescript
import { ExcelDataReader } from '../data-utils/excel-data-reader';

const reader = new ExcelDataReader();
const users  = reader.readSheet<{ email: string; password: string }>(
    'test-data-excel/users.xlsx',
    'LoginData',
);
```

---

### Locator Strategy — how unique locators are selected

```
Priority 1 → data-testid="submit-btn"      →  page.getByTestId('submit-btn')
Priority 2 → data-qa="username"            →  page.locator('[data-qa="username"]')
Priority 3 → aria-label="Search"           →  page.locator('[aria-label="Search"]')
Priority 4 → id="email"                    →  page.locator('#email')
Priority 5 → role=button + name="Login"    →  page.getByRole('button', { name: 'Login' })
Priority 6 → placeholder="Enter email"     →  page.getByPlaceholder('Enter email')
Priority 7 → <label for="pwd">Password     →  page.getByLabel('Password')
Priority 8 → visible text "Submit"         →  page.getByText('Submit', { exact: true })
Priority 9 → CSS selector (fallback)       →  page.locator('form > div:nth-of-type(2) > input')
```

The resolver verifies that the chosen locator matches **exactly one element** on the page before
returning it.  If none are unique, it returns the highest-priority candidate with a warning flag.

---

### MCP + BDD fixtures

Import `Given / When / Then` from `fixtures/bdd-fixtures.ts` instead of `playwright-bdd`
to get `mcpRecorder` and `fieldScanner` injected automatically:

```typescript
// steps/my-steps.ts
import { Given, When, Then } from '../fixtures/bdd-fixtures';

When('I scan the current page', async ({ fieldScanner }) => {
    const result = await fieldScanner.scan();
    await fieldScanner.saveScanReport(result, 'test-data/current-page-scan.json');
    await fieldScanner.generatePageObject(result, 'pages/current-page.ts', 'CurrentPage');
});
```

---



### Feature Files
- ✅ Use descriptive feature and scenario names
- ✅ Keep scenarios focused and independent
- ✅ Use tags (@smoke, @regression) for test organization
- ✅ Use scenario outlines for data-driven tests
- ✅ Keep steps business-readable (avoid technical details)

### Page Objects
- ✅ One class per page or component
- ✅ Use private locators, public methods
- ✅ Methods should represent user actions
- ✅ Return promises or values, not page objects (unless chaining)
- ✅ Add JSDoc comments for better documentation

### Step Definitions
- ✅ Keep steps atomic and reusable
- ✅ Import page objects, don't create UI logic here
- ✅ Use TypeScript parameter types
- ✅ Group related steps in same file
- ✅ Avoid duplicate step definitions

### Test Data
- ✅ Separate test data from test code
- ✅ Use JSON for simple data, Excel for complex datasets
- ✅ Create type definitions for data structures
- ✅ Use meaningful data names
- ✅ Don't hardcode sensitive data

### TypeScript
- ✅ Define interfaces for all data structures
- ✅ Use type safety throughout
- ✅ Leverage IDE autocomplete
- ✅ Add JSDoc comments for public methods

### General
- ✅ Use Playwright's auto-waiting (avoid hardcoded sleeps)
- ✅ Run tests locally before committing
- ✅ Review test reports after execution
- ✅ Keep framework dependencies updated
- ✅ Follow consistent naming conventions

---

## 🔄 Cloning for New Projects

### Step-by-Step Guide

1. **Clone the framework**
   ```bash
   git clone https://github.com/Murugavel-QA/Playwright-framework-setup.git my-new-project
   cd my-new-project
   ```

2. **Remove framework git history**
   ```bash
   rm -rf .git
   git init
   ```

3. **Install dependencies**
   ```bash
   npm install
   npx playwright install
   ```

4. **Update package.json**
   ```json
   {
     "name": "my-new-project",
     "description": "Automation for My New Project"
   }
   ```

5. **Configure for your application**
   - Update `baseURL` in [playwright.config.ts](playwright.config.ts)
   - Add your application URLs

6. **Start building tests**
   - Use sample files as templates
   - Delete samples when you have your own tests
   - Follow the same structure

7. **Push to your project repository**
   ```bash
   git add .
   git commit -m "Initial framework setup"
   git remote add origin <your-project-repo-url>
   git push -u origin master
   ```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright BDD Plugin](https://github.com/vitalets/playwright-bdd)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Allure Reports](https://docs.qameta.io/allure/)

---

## 🤝 Contributing

This is a reusable framework template. When you find improvements:
1. Create a new branch
2. Make your changes
3. Submit a pull request to improve the framework for everyone

---

## 📄 License

This framework is available for use in any project.

---

**Framework maintained by: Murugavel-QA**  
**Last Updated: February 2026**

let loginPage: LoginPage;

// Load Excel data
const excelPath = 'test-data-excel/login-data.xlsx';
ExcelDataReader.loadExcelFile(excelPath);
const config = ExcelDataReader.getDataByKey('LoginData', 'dataKey', 'config');
