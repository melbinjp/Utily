# Contributing

We welcome contributions to improve this project. Please follow these guidelines to ensure a smooth development process.

## Development Workflow

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/melbinjp/Utily.git
    cd Utily
    ```

2.  **Install dependencies:**
    This project uses `npm`. It is recommended to use `npm ci` for clean installs to ensure you are using the exact versions from `package-lock.json`.

    ```bash
    npm ci
    ```

3.  **Create a new branch:**
    Create a descriptive branch name for your feature or fix.

    ```bash
    git checkout -b <branch-name>
    ```

4.  **Make your changes.**

5.  **Build the project:**
    Before testing, you must build the static assets.

    ```bash
    npm run build
    ```

6.  **Run the full verification matrix:**
    To ensure your changes are safe and effective, you must run the full suite of local checks. This includes linting, formatting, and all tests.

    First, start the local server in one terminal window:

    ```bash
    npm run preview
    ```

    Then, in another terminal, run the test suite. Make sure to set the `CHROME_PATH` variable so Lighthouse can find the browser installed by Playwright.

    ```bash
    export CHROME_PATH=$(node -p 'require("playwright").chromium.executablePath()')
    npm test
    ```

7.  **Commit your changes:**
    Follow the conventional commit format for your commit messages (e.g., `feat: add new feature`, `fix: correct a bug`).

8.  **Open a Pull Request:**
    Push your branch to the repository and open a pull request against the `main` branch. Please fill out the PR template completely.

## Coding Standards

- **Formatting:** This project will use `prettier` for automated code formatting. Please run `npm run format` before committing.
- **Linting:** This project will use `eslint` for JavaScript and `stylelint` for CSS. Please run `npm run lint` to check for issues.
- **Selectors:** For new interactive elements or elements targeted in tests, please add a `data-test-id` attribute.
