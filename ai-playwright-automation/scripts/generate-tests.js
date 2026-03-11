#!/usr/bin/env node
'use strict';

/**
 * generate-tests.js
 *
 * Reads a requirement markdown file and produces a Playwright .spec.ts
 * stub in the tests/ folder.  The stub contains the AI prompt as a
 * comment block so that GitHub Copilot can generate the full test suite
 * when you open the file in VS Code.
 *
 * Usage:
 *   node scripts/generate-tests.js --requirement <path-to-requirement.md>
 *   node scripts/generate-tests.js --requirement <path> --prompt <path-to-prompt.md>
 *   node scripts/generate-tests.js requirements/login.feature.md
 *
 * Options:
 *   --requirement, -r   Path to the requirement markdown file (required)
 *   --prompt, -p        Path to the prompt template file
 *                       (default: prompts/test-generation-prompt.md)
 *   --output, -o        Output directory for generated spec files
 *                       (default: tests/)
 *   --help, -h          Show this help message
 *
 * Examples:
 *   node scripts/generate-tests.js --requirement requirements/login.feature.md
 *   node scripts/generate-tests.js --requirement requirements/checkout.feature.md
 */

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function showHelp() {
  console.log(`
Usage:
  node scripts/generate-tests.js --requirement <path-to-requirement.md> [options]

Options:
  --requirement, -r   Path to the requirement markdown file (required)
  --prompt, -p        Path to the AI prompt template
                      (default: prompts/test-generation-prompt.md)
  --output, -o        Output directory for the generated spec file
                      (default: tests/)
  --help, -h          Show this help message

Examples:
  node scripts/generate-tests.js --requirement requirements/login.feature.md
  node scripts/generate-tests.js -r requirements/checkout.feature.md -o tests/
`);
}

function parseArgs(argv) {
  const args = { requirement: null, prompt: null, output: null };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    }

    if ((arg === '--requirement' || arg === '-r') && argv[i + 1]) {
      args.requirement = argv[++i];
      continue;
    }

    if ((arg === '--prompt' || arg === '-p') && argv[i + 1]) {
      args.prompt = argv[++i];
      continue;
    }

    if ((arg === '--output' || arg === '-o') && argv[i + 1]) {
      args.output = argv[++i];
      continue;
    }

    // Treat a bare positional argument as the requirement file
    if (!arg.startsWith('-') && !args.requirement) {
      args.requirement = arg;
    }
  }

  return args;
}

function resolveFromScriptDir(relativePath) {
  // The script lives in scripts/; project root is one level up
  return path.resolve(__dirname, '..', relativePath);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.requirement) {
    console.error('Error: --requirement <file> is required.\n');
    showHelp();
    process.exit(1);
  }

  // Resolve paths relative to the project root (parent of scripts/)
  const requirementPath = path.isAbsolute(args.requirement)
    ? args.requirement
    : resolveFromScriptDir(args.requirement);

  const promptPath = args.prompt
    ? (path.isAbsolute(args.prompt) ? args.prompt : resolveFromScriptDir(args.prompt))
    : resolveFromScriptDir('prompts/test-generation-prompt.md');

  const outputDir = args.output
    ? (path.isAbsolute(args.output) ? args.output : resolveFromScriptDir(args.output))
    : resolveFromScriptDir('tests');

  // Validate requirement file
  if (!fs.existsSync(requirementPath)) {
    console.error(`Error: Requirement file not found: ${requirementPath}`);
    process.exit(1);
  }

  // Load prompt template (optional – use a built-in default if missing)
  let promptTemplate = '';
  if (fs.existsSync(promptPath)) {
    promptTemplate = fs.readFileSync(promptPath, 'utf8');
  } else {
    console.warn(`Warning: Prompt file not found at ${promptPath}. Using built-in default.`);
    promptTemplate = [
      'You are a senior QA automation engineer.',
      'Convert the following requirement into Playwright automation tests.',
      'Rules:',
      '- Use Playwright test framework (@playwright/test)',
      '- Generate positive and negative tests',
      '- Use clear test titles',
      '- Use test.describe blocks',
      '- Cover all acceptance criteria',
      '- Generate edge case tests',
      '- Use async/await throughout',
      '- Target 20 to 50 individual test cases',
      '',
      'Requirement:',
      '[REQUIREMENT_CONTENT]',
    ].join('\n');
  }

  // Read requirement
  const requirementContent = fs.readFileSync(requirementPath, 'utf8');

  // Embed requirement into prompt
  const filledPrompt = promptTemplate.replace('[REQUIREMENT_CONTENT]', requirementContent);

  // Determine output file name  (login.feature.md → login.spec.ts)
  const baseName    = path.basename(requirementPath);           // login.feature.md
  const specName    = baseName.replace(/\.feature\.md$/i, '').replace(/\.md$/i, '') + '.spec.ts';
  const outputPath  = path.join(outputDir, specName);

  // Ensure the output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Build the spec file content
  const specContent = [
    '/*',
    ' * AUTO-GENERATED STUB – AI Playwright Test Generation',
    ' * =====================================================',
    ' * File    : ' + specName,
    ' * Source  : ' + path.relative(outputDir, requirementPath),
    ' * Created : ' + new Date().toISOString(),
    ' *',
    ' * HOW TO USE:',
    ' * 1. Open this file in VS Code with GitHub Copilot enabled.',
    ' * 2. Place your cursor at the END of this comment block (after the closing */).',
    ' * 3. Press Tab or Alt+\\ to trigger Copilot.',
    ' * 4. Copilot will read the requirement below and generate 20–50 test cases.',
    ' * 5. Review and adjust the generated tests for your application.',
    ' *',
    ' * PROMPT + REQUIREMENT:',
    ' * ----------------------',
    filledPrompt.split('\n').map(line => ' * ' + line).join('\n'),
    ' */',
    '',
    "import { test, expect } from '@playwright/test';",
    '',
    '// GitHub Copilot: please generate the full test suite based on the',
    '// requirement and rules described in the comment block above.',
    '// Start with a test.describe block named after the feature.',
    '',
  ].join('\n');

  fs.writeFileSync(outputPath, specContent, 'utf8');

  console.log(`✅ Spec stub generated: ${outputPath}`);
  console.log(`   Open the file in VS Code and let GitHub Copilot complete the tests.`);
}

main();
