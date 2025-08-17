# Secret Management

This document lists the environment secrets required for the CI/CD pipeline and local development.

**Do not commit any secret values to the repository.** Secrets should be stored in GitHub repository secrets.

## Required Secrets

| Secret Name    | Description                                                         | Used In |
| -------------- | ------------------------------------------------------------------- | ------- |
| `GITHUB_TOKEN` | (Provided by GitHub) Used to deploy to GitHub Pages and update PRs. | CI      |

## Optional Secrets for Future Use

| Secret Name  | Description                                                                  | Used In |
| ------------ | ---------------------------------------------------------------------------- | ------- |
| `SENTRY_DSN` | The DSN for Sentry error reporting. If set, error reporting will be enabled. | N/A     |

To add secrets, navigate to your repository's `Settings > Secrets and variables > Actions` and add them as "Repository secrets".
