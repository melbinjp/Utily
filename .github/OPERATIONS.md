# Operations Manual

This document provides instructions for operating and maintaining this application.

## Running Verifications Locally

To ensure code quality and stability, all verification checks should be run locally before pushing changes.

### 1. Install Dependencies

If you haven't already, install the project dependencies:

```bash
npm install
```

_Note: `npm install` is preferred over `npm ci` for local development to allow for package updates._

### 2. Run the Full Verification Matrix

This single command will build the site, run a local server, execute all tests (linting, formatting, Playwright, and Lighthouse), and then shut down the server.

```bash
pkill -f http-server || true && npm run build && npm run preview & server_pid=$! && sleep 5 && export CHROME_PATH=$(node -p 'require("playwright").chromium.executablePath()') && npm test && kill $server_pid
```

Alternatively, you can run the steps manually:

**1. Build the site:**

```bash
npm run build
```

**2. Start the local server in one terminal window:**

```bash
npm run preview
```

**3. In another terminal, run the verification checks:**

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

- **Trigger:** A `push` or `pull_request` to the `main` branch will trigger the build and test process. A deployment to GitHub Pages will only occur on a successful push to `main`.
- **Environment:** The site is deployed to GitHub Pages.
- **Status:** The status of the deployment can be monitored in the "Actions" tab of the GitHub repository.

## Rollback Plan

In the event of a faulty deployment, the site can be rolled back to a previous stable version.

1.  **Git Revert (Preferred):** Create a new commit that undoes the faulty changes. This is the safest method as it preserves project history.

    ```bash
    # Revert the last commit
    git revert HEAD --no-edit

    # Push the revert commit to main
    git push origin main
    ```

    This will trigger a new, clean deployment of the last known good state.

2.  **GitHub Pages Redeployment:** For a hotfix, you can redeploy a specific previous build.
    - Navigate to the repository's **Settings** tab.
    - Go to the **Pages** section.
    - In the "Build and deployment" section, find a previous, successful deployment in the history.
    - Click the "..." menu next to it and select "Re-run all jobs" to redeploy that specific version.
