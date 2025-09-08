const { test, expect } = require('@playwright/test');

test.describe('Functional Tests', () => {
  const targetUrl = 'http://localhost:8080';

  // Helper: wait until the lazy-loaded carousel instance is present
  async function waitForCarouselInitialized(page, timeout = 10000) {
    await page.locator('.hero-carousel').first().waitFor({ state: 'attached', timeout });
    await page.waitForFunction(() => {
      const el = document.querySelector('.hero-carousel');
      return !!(el && el.__carousel && typeof el.__carousel.pauseAutoplay === 'function');
    }, { timeout });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto(targetUrl, { timeout: 60000 });
    await expect(page.locator('#tool-grid .tool-card').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('should filter tool cards when a category is selected', async ({ page }) => {
    // Click on the 'AI & ML' filter
    await page.click('button[data-filter="ai"]');
    // Wait for the filtering to apply
    await expect(
      page.locator('#tool-grid .tool-card:not(.hidden)').first()
    ).toHaveAttribute('data-category', 'ai');
    // Get all visible tool cards
    const visibleCards = page.locator('#tool-grid .tool-card:not(.hidden)');
    const count = await visibleCards.count();
    expect(count).toBeGreaterThan(0);
    // Check that all visible cards have the 'ai' category
    for (let i = 0; i < count; i++) {
      const card = visibleCards.nth(i);
      await expect(card).toHaveAttribute('data-category', 'ai');
    }
    // Click on the 'Media' filter
    await page.click('button[data-filter="media"]');
    await expect(
      page.locator('#tool-grid .tool-card:not(.hidden)').first()
    ).toHaveAttribute('data-category', 'media');
    const visibleMediaCards = page.locator('#tool-grid .tool-card:not(.hidden)');
    const mediaCount = await visibleMediaCards.count();
    expect(mediaCount).toBeGreaterThan(0);
    for (let i = 0; i < mediaCount; i++) {
      const card = visibleMediaCards.nth(i);
      await expect(card).toHaveAttribute('data-category', 'media');
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
    await page.route('**/tools.json', (route) => {
      route.abort();
    });
    // Reload the page to trigger the fetch
    await page.reload();
    // Check if the error message is visible
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible({ timeout: 10000 }); // Increase timeout to 10 seconds
    await expect(errorMessage).toContainText('Failed to load AI tools', { timeout: 10000 });
  });

  test('carousel keyboard navigation should only work when focused', async ({ page }) => {
    // Ensure carousel is initialized (it is lazy-loaded)
    await waitForCarouselInitialized(page);

    // Disable autoplay using the carousel instance API (safer than poking properties)
    await page.evaluate(() => {
      const carouselEl = document.querySelector('.hero-carousel');
      if (carouselEl && carouselEl.__carousel) {
        carouselEl.__carousel.autoplayEnabled = false;
        carouselEl.__carousel.pauseAutoplay();
      }
    });

    const getActiveSlideIndex = async () => {
  await page.locator('.carousel-indicators .indicator.active').first().waitFor({ state: 'visible', timeout: 5000 });
  const activeIndicator = page.locator('.carousel-indicators .indicator.active');
      return await activeIndicator.getAttribute('data-index');
    };

    // 1. Check initial slide
    const initialSlideIndex = await getActiveSlideIndex();
    expect(initialSlideIndex).toBe('0');

    // 2. Press ArrowRight on the body (unfocused) — slide should NOT change
    await page.locator('body').press('ArrowRight');
    const afterUnfocusedPress = await getActiveSlideIndex();
    expect(afterUnfocusedPress).toBe(initialSlideIndex);

    // 3. Focus carousel and press ArrowRight — slide SHOULD advance
    await page.locator('.hero-carousel').focus();
    await page.locator('.hero-carousel').press('ArrowRight');
    const afterFocusedPress = await getActiveSlideIndex();
    expect(afterFocusedPress).not.toBe(initialSlideIndex);
  });
});
