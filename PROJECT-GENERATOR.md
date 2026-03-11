# Playwright BDD Project Generator Template

Use this template to quickly scaffold a new Playwright BDD test automation project from an existing repository or template.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Approach 1: Prompt-Based Generation](#approach-1-prompt-based-generation)
- [Approach 2: MCP-Based Generation](#approach-2-mcp-based-generation)
- [Project Configuration Checklist](#project-configuration-checklist)
- [Sample Prompts Library](#sample-prompts-library)

---

## Quick Start

### Prerequisites
- Node.js v18+ installed
- Git installed
- VS Code with GitHub Copilot (for prompt-based)
- MCP server configured (for MCP-based)

### Repository URL
```
[YOUR_TEMPLATE_REPOSITORY_URL]
```

---

## Approach 1: Prompt-Based Generation

Use AI assistants (GitHub Copilot, Claude, etc.) with these prompts to generate a new project.

### Step 1: Clone and Setup

**Prompt:**
```
Clone the repository from [REPOSITORY_URL] and set up a new Playwright BDD 
automation project named "[PROJECT_NAME]" in the directory "[TARGET_DIRECTORY]".

After cloning:
1. Update package.json with the new project name
2. Remove any existing test data and feature files
3. Keep the framework structure intact (pages/, steps/, features/, types/, data-utils/)
4. Install all dependencies
5. Verify Playwright browsers are installed
```

### Step 2: Configure for Your Application

**Prompt:**
```
Configure the Playwright BDD project for my application:

Application Details:
- Base URL: [YOUR_APP_URL]
- Application Name: [APP_NAME]
- Environment: [dev/staging/prod]

Please:
1. Update playwright.config.ts with the base URL
2. Create a new login-data.xlsx with placeholder credentials
3. Update any hardcoded URLs in test-data files
4. Set appropriate timeouts for my application type
```

### Step 3: Generate Page Objects

**Prompt:**
```
Create a Page Object class for the [PAGE_NAME] page with these elements:

Page URL: [PAGE_PATH]
Elements:
- [element1]: [locator_type] = [locator_value]
- [element2]: [locator_type] = [locator_value]
- [element3]: [locator_type] = [locator_value]

Actions needed:
- [action1_description]
- [action2_description]

Follow the existing Page Object pattern in the pages/ directory using 
Playwright Locator types and async methods.
```

### Step 4: Generate Feature Files

**Prompt:**
```
Create a BDD feature file for [FEATURE_NAME] with these scenarios:

Feature: [Feature Description]

Scenarios:
1. [Scenario 1 description]
2. [Scenario 2 description]
3. [Scenario 3 description]

Include appropriate tags (@smoke, @regression, @[custom_tag]) and follow 
the Given/When/Then format. Reference the existing feature files in 
features/ directory for style consistency.
```

### Step 5: Generate Step Definitions

**Prompt:**
```
Create step definitions for the feature file [FEATURE_FILE_NAME].feature

Map these steps to the Page Object [PAGE_OBJECT_NAME]:
- Given steps for [setup_actions]
- When steps for [user_actions]  
- Then steps for [assertions]

Use the playwright-bdd createBdd() pattern and ExcelDataReader for test data.
Include proper page object initialization in each step that needs it.
```

### Step 6: Generate Type Definitions

**Prompt:**
```
Create a TypeScript interface for [DATA_TYPE_NAME] test data with these fields:

Fields:
- dataKey: string (identifier)
- [field1]: [type]
- [field2]: [type]
- [field3]: [type] (optional)

Place in types/ directory following the existing naming convention.
Export the interface for use in step definitions and page objects.
```

---

## Approach 2: MCP-Based Generation

Use Model Context Protocol (MCP) tools for automated project generation.

### Prerequisites

Ensure these MCP servers are configured in your VS Code settings:

```json
{
  "mcp.servers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem"]
    }
  }
}
```

### MCP Tool Commands

#### 1. Clone Repository

Use MCP GitHub tools to clone the template:

```
Tool: mcp_github_clone_repository
Parameters:
  - repository_url: "[TEMPLATE_REPO_URL]"
  - target_directory: "[TARGET_PATH]"
  - branch: "main"
```

#### 2. Create Directory Structure

Use MCP Filesystem tools:

```
Tool: mcp_filesystem_create_directory
Parameters:
  - path: "[PROJECT_PATH]/pages/[module_name]"

Tool: mcp_filesystem_create_directory
Parameters:
  - path: "[PROJECT_PATH]/features"

Tool: mcp_filesystem_create_directory
Parameters:
  - path: "[PROJECT_PATH]/steps"
```

#### 3. Create Files from Templates

```
Tool: mcp_filesystem_write_file
Parameters:
  - path: "[PROJECT_PATH]/pages/[module]/[page-name]-page.ts"
  - content: "[PAGE_OBJECT_TEMPLATE]"

Tool: mcp_filesystem_write_file
Parameters:
  - path: "[PROJECT_PATH]/features/[feature-name].feature"
  - content: "[FEATURE_TEMPLATE]"

Tool: mcp_filesystem_write_file
Parameters:
  - path: "[PROJECT_PATH]/steps/[step-name]-steps.ts"
  - content: "[STEP_DEFINITION_TEMPLATE]"
```

#### 4. Install Dependencies (Terminal)

```
Tool: run_in_terminal
Command: cd "[PROJECT_PATH]" && npm install && npx playwright install
```

### MCP Workflow Script

Create this as an automated workflow:

```yaml
# project-generator-workflow.yaml
name: Generate Playwright BDD Project

inputs:
  project_name: string
  target_directory: string
  base_url: string

steps:
  - name: Clone template
    tool: mcp_github_clone_repository
    params:
      url: $TEMPLATE_REPO_URL
      path: $target_directory/$project_name

  - name: Update package.json
    tool: mcp_filesystem_read_file
    params:
      path: $target_directory/$project_name/package.json
    then:
      tool: mcp_filesystem_write_file
      params:
        path: $target_directory/$project_name/package.json
        content: $updated_package_json

  - name: Create config
    tool: mcp_filesystem_write_file
    params:
      path: $target_directory/$project_name/test-data-excel/config.xlsx

  - name: Install dependencies
    tool: run_in_terminal
    params:
      command: npm install
      cwd: $target_directory/$project_name

  - name: Verify setup
    tool: run_in_terminal
    params:
      command: npx playwright test --list
      cwd: $target_directory/$project_name
```

---

## Project Configuration Checklist

Use this checklist when setting up a new project:

### Initial Setup
- [ ] Repository cloned/copied
- [ ] Project name updated in `package.json`
- [ ] Dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)

### Configuration Files
- [ ] `playwright.config.ts` - Base URL configured
- [ ] `playwright.config.ts` - Timeouts adjusted
- [ ] `playwright.config.ts` - Browser projects configured
- [ ] `tsconfig.json` - Path aliases correct
- [ ] `.gitignore` - Sensitive data excluded

### Test Data Setup
- [ ] `test-data-excel/login-data.xlsx` - Credentials added
- [ ] `test-data-excel/*.xlsx` - Test data files created
- [ ] `test-data/*.json` - JSON configs updated
- [ ] `Uploadfiles/` - Test upload files added

### Framework Structure
- [ ] `pages/` - Page objects created for each module
- [ ] `steps/` - Step definitions implemented
- [ ] `features/` - Feature files with scenarios
- [ ] `types/` - TypeScript interfaces defined
- [ ] `data-utils/` - Data readers configured

### Verification
- [ ] Tests run without errors: `npm test`
- [ ] HTML report generates: Check `html-report/`
- [ ] Allure report works: `npm run allure:generate`

---

## Sample Prompts Library

### Create Complete Module

```
Create a complete test module for [MODULE_NAME] functionality:

1. Page Object: pages/[module]/[module]-page.ts
   - Elements: [list elements with locators]
   - Methods: [list required actions]

2. Feature File: features/[module].feature
   - Scenario 1: [description]
   - Scenario 2: [description]

3. Step Definitions: steps/[module]-steps.ts
   - Map all feature steps to page object methods
   - Use Excel data from test-data-excel/[module]-data.xlsx

4. Type Definition: types/[module]-data.ts
   - Interface for [module] test data

5. Test Data: Create Excel structure for test-data-excel/[module]-data.xlsx
```

### Add New User Role

```
Add a new user role "[ROLE_NAME]" to the existing login framework:

1. Update test-data-excel/login-data.xlsx with new row:
   - dataKey: [role_key]
   - userName: [username]
   - passWord: [password]

2. Add step in steps/login-steps.ts:
   When("I login as [ROLE_NAME]", async () => {
     // implementation
   });

3. Update any role-specific feature scenarios
```

### Generate Data-Driven Tests

```
Create data-driven scenarios for [FEATURE_NAME]:

Excel Data Structure (test-data-excel/[feature]-data.xlsx):
| dataKey | [field1] | [field2] | [field3] | expectedResult |
|---------|----------|----------|----------|----------------|
| case1   | value1   | value2   | value3   | expected1      |
| case2   | value4   | value5   | value6   | expected2      |

Feature File with Scenario Outline:
- Use Examples table referencing Excel data keys
- Include positive and negative test cases

Step Definitions:
- Read data dynamically based on dataKey parameter
- Implement assertions for expectedResult
```

### API + UI Hybrid Test

```
Create a hybrid test that combines API setup with UI verification:

1. API Setup Step:
   Given("I create test data via API", async () => {
     // POST request to create data
     // Store response for UI verification
   });

2. UI Verification Steps:
   When("I navigate to [page]", async () => { });
   Then("I should see the API-created data", async () => { });

Include:
- API client utility in data-utils/
- Response interface in types/
- Feature file with @api-ui tag
```

---

## Template Variables Reference

Replace these placeholders when using the templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `[REPOSITORY_URL]` | Source template repo | `https://github.com/org/playwright-template` |
| `[PROJECT_NAME]` | New project name | `my-ecommerce-tests` |
| `[TARGET_DIRECTORY]` | Installation path | `C:\Projects\automation` |
| `[YOUR_APP_URL]` | Application base URL | `https://staging.myapp.com` |
| `[PAGE_NAME]` | Page object name | `ProductCatalog` |
| `[PAGE_PATH]` | URL path | `/products/catalog` |
| `[FEATURE_NAME]` | Feature name | `Shopping Cart` |
| `[MODULE_NAME]` | Module/folder name | `checkout_flow` |
| `[ROLE_NAME]` | User role | `Admin`, `Customer` |
| `[DATA_TYPE_NAME]` | Interface name | `ProductData` |

---

## Quick Reference Commands

```bash
# Initialize new project
npm init playwright@latest

# Install BDD support
npm install playwright-bdd --save-dev

# Install data utilities
npm install xlsx --save

# Install reporting
npm install allure-playwright allure-commandline --save-dev

# Run tests
npm test

# Run specific tag
npx playwright test --grep "@smoke"

# Generate reports
npm run allure:generate && npm run allure:open

# Debug mode
npx playwright test --debug

# Update Playwright
npm install @playwright/test@latest
npx playwright install
```

---

## Support

For issues with project generation:
1. Verify all prerequisites are installed
2. Check repository access permissions
3. Ensure MCP servers are properly configured
4. Review error logs in terminal output

---

*Template Version: 1.0.0*  
*Last Updated: March 2026*
