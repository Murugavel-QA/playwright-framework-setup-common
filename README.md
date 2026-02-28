# Playwright BDD Test Automation Framework

## 📋 Table of Contents
- [Overview](#overview)
- [Framework Architecture](#framework-architecture)
- [Directory Structure](#directory-structure)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Quick Start Guide](#quick-start-guide)
- [Best Practices](#best-practices)
- [Cloning for New Projects](#cloning-for-new-projects)

---

## 🎯 Overview

This is a **clean, reusable Playwright BDD Test Automation Framework structure** ready to clone for any automation project. The framework provides a complete folder structure with all necessary configurations pre-setup.

### Key Features
- ✅ **BDD with Gherkin**: Ready for human-readable feature files
- ✅ **Page Object Model**: Structured folders for page objects
- ✅ **TypeScript**: Pre-configured with type safety
- ✅ **Excel Data Management**: Built-in Excel reader utility
- ✅ **Allure Reporting**: HTML and Allure reporting configured
- ✅ **Modular Architecture**: Clean folder structure
- ✅ **Zero Boilerplate**: Empty folders ready for your code
- ✅ **Production Ready**: All configurations and dependencies included

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

## 📝 Best Practices

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
