# Operations Guide

This document provides instructions for deploying, testing, and managing the website.

## Continuous Integration (CI)

The CI pipeline is defined in `.github/workflows/deploy.yml`. It is triggered on every push to the `main` branch and on every pull request targeting `main`.

The pipeline consists of the following jobs:

1.  **`build`**: Installs dependencies and builds the static site into the `dist/` directory. The resulting `dist` folder is uploaded as an artifact.
2.  **`test`**: Downloads the build artifact and runs a series of checks:
    *   **Smoke Tests**: Uses Playwright to verify that the main page loads and key content is visible.
    *   **Accessibility Tests**: Uses `axe-core` via Playwright to check for critical accessibility violations.
    *   **Performance Tests**: Uses Lighthouse CI to audit the site against performance, accessibility, best practices, and SEO budgets defined in `lighthouserc.js`.

3.  **`deploy`**: If the `test` job succeeds and the trigger was a push to `main`, this job deploys the build artifact to the `gh-pages` branch, which is then served by GitHub Pages.

## Running Tests Locally

To run all checks locally, you first need to build the site, then run the tests.

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Run Playwright E2E and accessibility tests
# This will run tests in headless mode.
npm run test:e2e

# Run Lighthouse performance audit
# This command starts a server, runs tests, and then shuts down.
# The CHROME_PATH is needed to tell Lighthouse where to find the browser installed by Playwright.
CHROME_PATH="$(npm run-script-if-present -s echo $(node -p 'require("playwright").chromium.executablePath()'))" npm run test:lighthouse
```

## Deployment

Deployment is handled automatically by the CI pipeline. Every commit pushed to the `main` branch that passes all tests will be deployed to production.

### Manual Deployment

To trigger a manual deployment, you can re-run the last successful workflow run on the `main` branch from the GitHub Actions tab.

### Rollback

To roll back to a previous version, identify the commit hash of the last known good state. Then, revert the merge commit on the `main` branch that introduced the bad change:

```bash
# Revert the problematic merge commit
git revert -m 1 <MERGE_COMMIT_HASH>

# Push the revert commit to main
git push origin main
```

This will trigger the CI/CD pipeline, which will deploy the last known good version of the site.

## Security

### Content Security Policy (CSP)

A Content Security Policy is not yet enforced. A strict CSP should be added to the `<meta http-equiv="Content-Security-Policy" ...>` tag in `index.html` to mitigate XSS and other injection attacks. This was flagged as an issue in the initial Lighthouse report.

### HSTS & Secure Cookies

Since the site is hosted on GitHub Pages, HSTS (HTTP Strict Transport Security) is managed by GitHub. There are no cookies used by the site itself.
