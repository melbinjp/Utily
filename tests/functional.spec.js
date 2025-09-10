const { test, expect } = require('@playwright/test');

test.describe('Functional Tests', () => {
  const targetUrl = 'http://localhost:8080';

  test.beforeEach(async ({ page }) => {
    await page.goto(targetUrl, { timeout: 60000 });
    await expect(page.locator('#tool-grid .tool-card').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('should have a clickable "Try it now" link in the featured tool card', async ({
    page,
  }) => {
    // Wait for the carousel to be ready
    await expect(
      page
        .locator('.carousel-item.active .featured-actions .primary-btn')
        .first()
    ).toBeVisible({ timeout: 10000 });

    // Get the first featured tool card's "Try it now" button
    const tryItNowButton = page
      .locator('.carousel-item.active .featured-actions .primary-btn')
      .first();

    // Check that it's an 'a' tag
    const tagName = await tryItNowButton.evaluate((node) => node.tagName);
    expect(tagName.toLowerCase()).toBe('a');

    // Check that it has an href attribute
    const href = await tryItNowButton.getAttribute('href');
    expect(href).not.toBeNull();
    expect(href.length).toBeGreaterThan(0);
    expect(href).not.toBe('#');
  });

  test('should toggle dark mode when theme button is clicked', async ({
    page,
  }) => {
    const html = page.locator('html');
    const themeToggle = page.locator('.theme-toggle');

    // Check initial theme (should be light by default)
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Click to toggle to dark mode
    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Click again to toggle back to light mode
    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });
});
