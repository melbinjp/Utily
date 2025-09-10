const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('UI Tests for AI Tools Portal', () => {
  test.describe('Standard Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await expect(page.locator('#tool-grid .tool-card').first()).toBeVisible({ timeout: 20000 });
    });

    test.describe('Homepage', () => {
      test('should load the homepage and display the main content', async ({ page }) => {
        await expect(page).toHaveTitle(/WeCanUseAI/, 'Page title should be correct.');

        const mainNav = page.locator('nav[aria-label="Main navigation"]');
        await expect(mainNav).toBeVisible('Main navigation should be visible.');

        const toolCards = page.locator('#tool-grid .tool-card');
        const count = await toolCards.count();
        expect(count).toBeGreaterThan(0, 'There should be tool cards in the grid.');
      });

      test('should not have any critical accessibility violations', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'critical'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });

    test.describe('Functionality', () => {
      test('should have a clickable "Try it now" link in the featured tool card', async ({ page }) => {
        const tryItNowButton = page.locator('.carousel-item.active .featured-actions .primary-btn').first();

        await expect(tryItNowButton).toBeVisible({ timeout: 10000 });
        await expect(tryItNowButton).toHaveAttribute('href');

        const href = await tryItNowButton.getAttribute('href');
        expect(href).not.toBe('#', 'The "Try it now" link should have a valid href.');
      });

      test('should toggle dark mode when theme button is clicked', async ({ page }) => {
        const html = page.locator('html');
        const themeToggle = page.locator('.theme-toggle');

        await expect(html).toHaveAttribute('data-theme', 'light', 'Initial theme should be light.');

        await themeToggle.click();
        await expect(html).toHaveAttribute('data-theme', 'dark', 'Theme should toggle to dark.');

        await themeToggle.click();
        await expect(html).toHaveAttribute('data-theme', 'light', 'Theme should toggle back to light.');
      });
    });

    test.describe('Filtering', () => {
      const filters = [
        { name: 'All', category: 'all' },
        { name: 'AI & ML', category: 'ai' },
        { name: 'Media', category: 'media' },
        { name: 'Utilities', category: 'utility' },
      ];

      for (const filter of filters) {
        test(`should filter by ${filter.name}`, async ({ page }) => {
          const filterButton = page.locator(`.filter-btn[data-filter="${filter.category}"]`);
          await filterButton.click();

          await expect(filterButton).toHaveClass(/active/, `The ${filter.name} filter button should be active.`);

          const toolCards = page.locator('#tool-grid .tool-card');
          const toolCount = await toolCards.count();

          for (let i = 0; i < toolCount; i++) {
            const card = toolCards.nth(i);
            const cardCategory = await card.getAttribute('data-category');

            if (filter.category === 'all') {
              await expect(card).toBeVisible();
            } else {
              if (cardCategory === filter.category) {
                await expect(card).toBeVisible();
              } else {
                await expect(card).toBeHidden();
              }
            }
          }
        });
      }
    });

    test.describe('Carousel Navigation', () => {
      test('should navigate through the carousel using next and previous buttons', async ({ page }) => {
        const carousel = page.locator('#featured-tool-carousel');
        await expect(carousel).toBeVisible();

        const nextButton = carousel.locator('.carousel-control.next');
        const prevButton = carousel.locator('.carousel-control.prev');

        const initialActiveSlide = await carousel.locator('.carousel-item.active').getAttribute('data-tool-id');

        await nextButton.click();
        const activeSlideAfterNext = await carousel.locator('.carousel-item.active').getAttribute('data-tool-id');
        expect(activeSlideAfterNext).not.toBe(initialActiveSlide);

        await prevButton.click();
        const activeSlideAfterPrev = await carousel.locator('.carousel-item.active').getAttribute('data-tool-id');
        expect(activeSlideAfterPrev).toBe(initialActiveSlide);
      });

      test('should navigate to a specific slide by clicking an indicator', async ({ page }) => {
        const carousel = page.locator('#featured-tool-carousel');
        await expect(carousel).toBeVisible();

        const indicators = carousel.locator('.carousel-indicators .indicator');
        const indicatorCount = await indicators.count();

        if (indicatorCount > 1) {
          const targetIndicator = indicators.nth(1);
          await targetIndicator.click();

          const activeSlide = carousel.locator('.carousel-item.active');
          const tryItNowButton = activeSlide.locator('.primary-btn');

          await expect(tryItNowButton).toHaveAttribute('href', 'https://melbinjp.github.io/voice_notes/');
        }
      });
    });
  });

  test.describe('Error Handling', () => {
    test('should display an error message if fetching tools fails', async ({ page }) => {
      await page.route('**/tools.json', route => {
        route.abort();
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      const errorDiv = page.locator('.error-message');
      await expect(errorDiv).toBeVisible();
      await expect(errorDiv).toContainText('Failed to load AI tools. Please refresh the page.');

      const retryButton = errorDiv.locator('#retry-button');
      await expect(retryButton).toBeVisible();
    });
  });

  test.describe('Footer Links', () => {
    test('should have valid and non-broken links', async ({ page }) => {
      const footerLinks = page.locator('footer .footer-links a');
      const linkCount = await footerLinks.count();

      for (let i = 0; i < linkCount; i++) {
        const link = footerLinks.nth(i);
        const href = await link.getAttribute('href');

        expect(href).not.toBeNull();
        expect(href.length).toBeGreaterThan(0);
        expect(href).not.toBe('#');
      }
    });
  });
});
