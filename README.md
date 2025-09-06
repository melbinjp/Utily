# WeCanUseAI.com - AI Tools Portal

This repository contains the source code for WeCanUseAI.com, a portal showcasing a collection of AI-powered web tools and utilities. The project is a static HTML, CSS, and JavaScript application with a focus on performance, accessibility, and a clean, maintainable structure.

## 🚀 Key Features

- **Performance-Optimized**: Built to be fast, with a focus on achieving high Lighthouse scores.
- **Accessibility-First**: Designed to be usable by everyone, with a perfect Lighthouse accessibility score.
- **Modular JavaScript**: Code is split into modules for better maintainability and lazy loading.
- **Modern UI/UX**: A clean, responsive design with a featured tool carousel and a filterable grid of applications.
- **Dark Mode**: Supports a dark color scheme.
- **PWA Ready**: Includes a service worker and manifest for Progressive Web App capabilities.

## 🏛️ Architecture

The application is built with vanilla HTML, CSS, and JavaScript, emphasizing modularity and clean separation of concerns.

- **`index.html`**: The main entry point of the application. It defines the page structure and includes placeholders for dynamic content.
- **`style.css`**: The primary stylesheet, built using PostCSS and Tailwind CSS for utility-first styling.
- **`js/`**: Contains all the JavaScript modules.
  - **`main.js`**: The main script that kicks off the application. It imports and instantiates the `AIToolsPortal`.
  - **`AIToolsPortal.js`**: The core application class. It manages data fetching (`tools.json`), renders the tool grid, and handles UI interactions like theme switching and filtering.
  - **`Carousel.js`**: A self-contained module for the featured tools carousel. It is lazy-loaded by `AIToolsPortal.js` for better initial page load performance.
  - **`sw-register.js`**: Service worker registration script for PWA functionality.
  - **`utils.js`**: A place for shared utility functions (e.g., `escapeHtml`).
- **`tools.json`**: A JSON file that acts as a simple database for the AI tools displayed on the site. Each tool has properties like title, description, URL, and category.
- **`tests/`**: End-to-end tests using Playwright for functional testing.
- **`build.js`**: Custom build script that handles asset optimization and copying.
- **`dist/`**: The output directory for the production build (created during build process). All assets are optimized and copied here.

## Lighthouse Scores

The following scores were achieved after the latest optimizations:

### Mobile

- **Performance**: 74
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 98

### Desktop

- **Performance**: 80
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 98

_Note: The performance score is heavily impacted by the lack of server-side compression and caching in the development environment. With a properly configured server, this score should be significantly higher._

## 🔧 Development & Build Process

This project uses `npm` for dependency management and running build scripts.

### Prerequisites

- Node.js (LTS version)
- npm (comes with Node.js)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/wecanuseai.com.git
    cd wecanuseai.com
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Build Scripts

- **`npm run build`**: Creates a production-ready build in the `dist/` directory using `build.js`. This script performs the following tasks:
  - Optimizes and purges unused CSS with PostCSS and cssnano.
  - Minifies JavaScript with esbuild.
  - Copies all necessary files (`index.html`, `tools.json`, service worker, etc.) to the `dist/` directory.
  - Optimizes FontAwesome icons with subsetting.

- **`npm run build:css`**: Runs only the CSS optimization task.
- **`npm run build:js`**: Runs only the JavaScript minification task.
- **`npm run subset:fontawesome`**: Optimizes FontAwesome icons by including only used icons.

### Local Development

- **`npm run preview`**: Starts a local development server using `http-server` to serve the `dist/` directory. This is useful for testing the production build locally.

### Testing

- **`npm test`**: Runs the complete test suite (E2E tests + Lighthouse tests).
- **`npm run test:e2e`**: Runs end-to-end tests using Playwright.
- **`npm run test:lighthouse`**: Runs both mobile and desktop Lighthouse tests.
- **`npm run test:lighthouse:mobile`**: Runs Lighthouse on mobile emulation.
- **`npm run test:lighthouse:desktop`**: Runs Lighthouse on desktop emulation.

### Code Quality

- **`npm run lint`**: Runs ESLint and Stylelint to check code quality.
- **`npm run lint:js`**: Runs ESLint on JavaScript files.
- **`npm run lint:css`**: Runs Stylelint on CSS files.
- **`npm run format`**: Formats code using Prettier.
- **`npm run format:check`**: Checks if code is properly formatted.

### Performance Testing

- **`npm run lighthouse:mobile`**: Runs Lighthouse on the local development server with mobile emulation.
- **`npm run lighthouse:desktop`**: Runs Lighthouse on the local development server with desktop emulation.

_Before running the Lighthouse tests, make sure you have the local server running with `npm run preview`._

## 🚀 Deployment

The `dist/` directory contains the complete, optimized static site. You can deploy this directory to any static hosting service (e.g., GitHub Pages, Netlify, Vercel).

For optimal performance, ensure your hosting provider enables the following:

- **HTTP/2**: For faster resource loading.
- **Gzip/Brotli Compression**: To reduce the size of text-based assets (HTML, CSS, JS, JSON).
- **Cache-Control Headers**: To leverage browser caching for static assets.

A GitHub Actions workflow for automatic deployment to GitHub Pages is included in `.github/workflows/deploy.yml`.

## 📄 License

This project is open source and available under the MIT License.
