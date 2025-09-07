const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// @TODO: Temporarily disabled due to CI issues.
// test.describe('Homepage Smoke and Accessibility Tests', () => {
//   const targetUrl = 'http://localhost:8080'; // The server will be started by the workflow
//   test.beforeEach(async ({ page }) => {
//     // The page can be slow to load, so give it a longer timeout
//     await page.goto(targetUrl, { timeout: 60000 });
//     // The page loads content dynamically, so wait for the grid to populate
//     await expect(page.locator('#tool-grid .tool-card').first()).toBeVisible({
//       timeout: 15000,
//     });
//   });
//   test('should load the homepage and display the main content', async ({
//     page,
//   }) => {
//     // 1. Verify page title
//     await expect(page).toHaveTitle(/WeCanUseAI/);
//     // 2. Check if the main navigation is visible
//     const nav = page.locator('nav[aria-label="Main navigation"]');
//     await expect(nav).toBeVisible();
//     // 3. Check if the tool grid has been populated with tool cards
//     const toolCards = page.locator('#tool-grid .tool-card');
//     const count = await toolCards.count();
//     expect(count).toBeGreaterThan(0);
//   });
//   test('should not have any critical accessibility violations', async ({
//     page,
//   }) => {
//     const accessibilityScanResults = await new AxeBuilder({ page })
//       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'critical'])
//       .analyze();
//     expect(accessibilityScanResults.violations).toEqual([]);
//   });
// });
