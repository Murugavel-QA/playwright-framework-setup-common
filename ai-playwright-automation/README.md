# AI Playwright Automation

> **"AI Requirement → 1 click → 50 Playwright test cases"**
>
> A modern QA workflow that turns structured requirement documents into ready-to-run Playwright test suites with the help of **GitHub Copilot**.

---

## Architecture

```
requirements/<feature>.feature.md
          │
          ▼
node scripts/generate-tests.js   ← reads requirement + prompt template
          │
          ▼
tests/<feature>.spec.ts          ← stub file with AI prompt as a comment
          │
          ▼  (open in VS Code, press Tab / Alt+\)
GitHub Copilot completes the file
          │
          ▼
npx playwright test               ← runs locally, no CI/CD needed
          │
          ▼
npx playwright show-report        ← interactive HTML report
```

---

## Folder structure

```
ai-playwright-automation/
│
├── requirements/                 # Structured requirement documents
│   ├── login.feature.md          # Example: User Login feature
│   └── checkout.feature.md       # Example: Checkout flow
│
├── prompts/
│   └── test-generation-prompt.md # AI prompt rules for Copilot
│
├── tests/                        # Generated Playwright spec files live here
│
├── scripts/
│   └── generate-tests.js         # CLI tool: requirement → spec stub
│
├── playwright.config.ts          # Playwright configuration
├── package.json                  # NPM dependencies & scripts
└── README.md                     # This file
```

---

## Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **VS Code** with the [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension enabled

### 1 – Install dependencies

```bash
cd ai-playwright-automation
npm install
```

### 2 – Install Playwright browsers

```bash
npx playwright install
```

### 3 – Configure your application URL

Open `playwright.config.ts` and uncomment / set the `baseURL`:

```typescript
use: {
  baseURL: 'https://your-application-url.com',
}
```

---

## Workflow: requirement → tests

### Step 1 – Write (or update) a requirement

Open or create a file in `requirements/`. Follow the format of the existing examples:

```markdown
# Feature: My Feature

## Description
...

## Acceptance Criteria
### AC1 – ...
...

## Edge Cases
...
```

### Step 2 – Generate the spec stub

```bash
# Default (generates tests/login.spec.ts from requirements/login.feature.md)
npm run generate

# Custom requirement
node scripts/generate-tests.js --requirement requirements/checkout.feature.md

# Custom requirement + custom output directory
node scripts/generate-tests.js -r requirements/checkout.feature.md -o tests/
```

This creates a `tests/<feature>.spec.ts` file containing:
- A large `/* … */` comment block with the full AI prompt + the requirement text.
- An `import` statement ready for Copilot to complete.

### Step 3 – Let Copilot generate the tests

1. Open the generated `tests/<feature>.spec.ts` in **VS Code**.
2. Click at the end of the closing `*/` of the comment block.
3. Press `Tab` or `Alt+\` to trigger **GitHub Copilot**.
4. Copilot reads the embedded requirement and generates 20–50 `test()` cases.
5. Review the output, adjust selectors to match your application, and save.

### Step 4 – Run the tests

```bash
# Run all tests (headless)
npm test
# or
npx playwright test

# Run a single spec file
npx playwright test tests/login.spec.ts

# Run headed (see the browser)
npx playwright test --headed

# Run with a specific browser
npx playwright test --project=chromium
```

### Step 5 – View the report

```bash
npm run report
# or
npx playwright show-report
```

An interactive HTML report opens in your browser showing pass/fail status, screenshots, traces, and videos for failing tests.

---

## Adding a new feature

1. Create `requirements/<my-feature>.feature.md` using the existing files as a template.
2. Run `node scripts/generate-tests.js --requirement requirements/<my-feature>.feature.md`.
3. Open the generated spec file in VS Code and let Copilot complete it.
4. Run `npx playwright test tests/<my-feature>.spec.ts` to verify.

---

## Script reference

| npm script | Command | Description |
|------------|---------|-------------|
| `npm test` | `playwright test` | Run all tests |
| `npm run report` | `playwright show-report` | Open the HTML report |
| `npm run generate` | `node scripts/generate-tests.js …` | Generate a spec stub for `login.feature.md` |

### `generate-tests.js` CLI options

```
node scripts/generate-tests.js [options]

Options:
  --requirement, -r   Path to the requirement markdown file (required)
  --prompt, -p        Path to the AI prompt template
                      (default: prompts/test-generation-prompt.md)
  --output, -o        Output directory for the generated spec file
                      (default: tests/)
  --help, -h          Show this help message
```

---

## Notes

- **No CI/CD required** – this workflow is intentionally designed for **local execution**. Tests run on your machine via `npx playwright test`.
- **Adding pipelines later** – if you want to run tests in CI, copy `playwright.config.ts` values into your pipeline YAML and add `npm ci && npx playwright install --with-deps && npm test`.
- **Copilot quality** – the more detailed and structured your requirement file, the better the tests Copilot generates. Use the existing `login.feature.md` / `checkout.feature.md` as a reference format.
- **Selector maintenance** – Copilot generates tests with placeholder selectors (e.g. `#email`, `.error`). Update these to match your actual application's DOM before running.
- **`playwright-report/`** is `.gitignore`d by default. Commit your `tests/` folder to share generated tests with your team.

---

## Resources

- [Playwright documentation](https://playwright.dev/)
- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [VS Code Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
