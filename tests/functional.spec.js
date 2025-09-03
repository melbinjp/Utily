const { test, expect } = require('@playwright/test');

test.describe('Functional Tests', () => {
  const targetUrl = 'http://localhost:8080';

  test.beforeEach(async ({ page }) => {
    await page.goto(targetUrl, { timeout: 60000 });
    await expect(page.locator('#tool-grid .tool-card').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('should filter tool cards when a category is selected', async ({ page }) => {
    // Click on the 'AI & ML' filter
    await page.click('button[data-filter="ai"]');

    // Wait for the animation/transition to complete
    await page.waitForTimeout(500);

    // Get all visible tool cards
    const visibleCards = page.locator('#tool-grid .tool-card:not(.hidden)');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);

    // Check that all visible cards have the 'ai' category
    for (let i = 0; i < count; i++) {
      const card = visibleCards.nth(i);
      const category = await card.getAttribute('data-category');
      expect(category).toBe('ai');
    }

    // Click on the 'Media' filter
    await page.click('button[data-filter="media"]');
    await page.waitForTimeout(500);
    const visibleMediaCards = page.locator('#tool-grid .tool-card:not(.hidden)');
    const mediaCount = await visibleMediaCards.count();
    expect(mediaCount).toBeGreaterThan(0);

    for (let i = 0; i < mediaCount; i++) {
      const card = visibleMediaCards.nth(i);
      const category = await card.getAttribute('data-category');
      expect(category).toBe('media');
    }
  });

  test('should toggle dark mode when theme button is clicked', async ({ page }) => {
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

  test('should display an error message if tools.json fails to load', async ({ page }) => {
    // Intercept the network request for tools.json and make it fail
    await page.route('**/tools.json', route => {
      route.abort();
    });

    // Reload the page to trigger the fetch
    await page.reload();

    // Check if the error message is visible
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Failed to load AI tools');
  });

  test('carousel keyboard navigation should only work when focused', async ({ page }) => {
    const carousel = page.locator('.hero-carousel');
    const getActiveSlideIndex = async () => {
      const activeIndicator = page.locator('.carousel-indicators .indicator.active');
      return await activeIndicator.getAttribute('data-index');
    };

    // 1. Check initial slide
    const initialSlideIndex = await getActiveSlideIndex();
    expect(initialSlideIndex).toBe('0');

    // 2. Press ArrowRight on the body (unfocused)
    await page.locator('body').press('ArrowRight');

    // 3. Expect the slide NOT to have changed (this is the part that will fail)
    let currentSlideIndex = await getActiveSlideIndex();
    expect(currentSlideIndex).toBe(initialSlideIndex);

    // 4. Focus the carousel and press ArrowRight again
    await carousel.focus();
    await carousel.press('ArrowRight');

    // 5. Expect the slide TO have changed
    currentSlideIndex = await getActiveSlideIndex();
    expect(currentSlideIndex).not.toBe(initialSlideIndex);
    expect(currentSlideIndex).toBe('1');
  });
});
