# Operations Manual

This document provides instructions for operating and maintaining this application.

## Running Verifications Locally

To ensure code quality and stability, all verification checks should be run locally before pushing changes.

### 1. Install Dependencies
```bash
npm ci
```

### 2. Run the Full Verification Matrix
This command runs all checks: linting, formatting, security audit, and tests.

First, start the local server in one terminal window:
```bash
npm run preview
```

Then, in another terminal, run the verification checks:
```bash
# Set the CHROME_PATH for Lighthouse
export CHROME_PATH=$(node -p 'require("playwright").chromium.executablePath()')

# Run all checks
npm run format:check
npm run lint
npm run test
```

## Deployment

Deployment is handled automatically by the GitHub Actions workflow in `.github/workflows/deploy.yml`.

- **Trigger:** A `push` to the `main` branch will trigger the build, test, and deploy process.
- **Environment:** The site is deployed to GitHub Pages.
- **Status:** The status of the deployment can be monitored in the "Actions" tab of the GitHub repository.

## Rollback Plan

In the event of a faulty deployment, the site can be rolled back to a previous stable version using the GitHub Pages deployment history.

1.  Navigate to the repository's **Settings** tab.
2.  Go to the **Pages** section.
3.  In the "Build and deployment" section, you will see a history of deployments.
4.  Click the "..." menu next to a previous, successful deployment and select "Re-run job" or a similar option to redeploy that specific version.

Alternatively, a git revert can be used to create a new commit that undoes the faulty changes, which will then trigger a new, clean deployment.

```bash
# Revert the last commit
git revert HEAD

# Push the revert commit to main
git push origin main
```
