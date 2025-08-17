# Task Board

This document tracks prioritized tasks for improving the stability, performance, and maintainability of this repository.

## P1: High Priority

- [ ] **Establish full verification suite in CI.**
  - **Owner:** `@jules`
  - **Status:** In Progress
  - **Effort:** Medium
  - **Notes:** Add linting, formatting, and dependency security checks to the CI pipeline.

- [ ] **Remediate Lighthouse Failures.**
  - **Owner:** `@jules`
  - **Status:** In Progress
  - **Effort:** Medium
  - **Notes:** Address the critical `csp-xss` and `tap-targets` failures. Goal is to bring all Lighthouse scores to >= 85. The `total-byte-weight` and `unused-css-rules` failures remain blocked by an unresolved issue with Tailwind CSS purging.

- [ ] **(Blocked) Resolve Tailwind CSS Purging Issue.**
  - **Owner:** (suggest `@melbinjpaulose`)
  - **Status:** Blocked
  - **Effort:** High
  - **Notes:** The Tailwind CSS purging mechanism is not working despite numerous attempts to fix it. This results in a larger-than-necessary `style.css` file. Steps taken include: creating `tailwind.config.js` with correct content paths, removing `postcss-purgecss`, ensuring `@tailwind` directives are present, reverting to `@tailwindcss/postcss` when required by the build tools, and upgrading Tailwind packages. The issue persists and requires deeper investigation into the build environment or specific package versions.

## P2: Medium Priority

- [ ] **Investigate and Fix `npm audit` vulnerabilities.**
  - **Owner:** `@jules`
  - **Status:** Not Started
  - **Effort:** Medium
  - **Notes:** There are 7 high-severity vulnerabilities that need to be addressed.

- [ ] **Add Unit Tests for JavaScript Logic.**
  - **Owner:** (suggest `@melbinjpaulose`)
  - **Status:** Not Started
  - **Effort:** Low
  - **Notes:** While `js/main.js` is currently simple, adding a testing framework like `vitest` will be important as new logic is added.

## P3: Low Priority

- [ ] **Update Deprecated NPM Packages.**
  - **Owner:** (suggest `@melbinjpaulose`)
  - **Status:** Not Started
  - **Effort:** Low
  - **Notes:** Address `deprecated` warnings for `inflight`, `glob`, and `rimraf`. This is likely a matter of updating parent dependencies.

## Completed

- [x] **Establish baseline test and audit results.**
  - **Owner:** `@jules`
  - **Status:** Done
  - **Effort:** Small
  - **Notes:** E2E tests pass, but Lighthouse has multiple failures.
