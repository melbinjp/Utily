const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('UI Tests for AI Tools Portal', () => {
  test.describe('Standard Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#tool-grid .tool-card').first()).toBeVisible({
        timeout: 20000,
      });
    });

    test.describe('Homepage', () => {
      test('should load the homepage and display the main content', async ({
        page,
      }) => {
        await expect(page).toHaveTitle(
          /WeCanUseAI/,
          'Page title should be correct.'
        );

        const mainNav = page.locator('nav[aria-label="Main navigation"]');
        await expect(mainNav).toBeVisible('Main navigation should be visible.');

        const toolCards = page.locator('#tool-grid .tool-card');
        const count = await toolCards.count();
        expect(count).toBeGreaterThan(
          0,
          'There should be tool cards in the grid.'
        );
      });

      test('should not have any critical accessibility violations', async ({
        page,
      }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'critical'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });

    test.describe('Functionality', () => {
      test('should have a clickable "Try it now" link in the featured tool card', async ({
        page,
      }) => {
        const tryItNowButton = page
          .locator('.carousel-item.active .featured-actions .primary-btn')
          .first();

        await expect(tryItNowButton).toBeVisible({ timeout: 10000 });
        await expect(tryItNowButton).toHaveAttribute('href', /.*/);
      });

      test('should toggle dark mode when theme button is clicked', async ({
        page,
      }) => {
        const html = page.locator('html');
        const themeToggle = page.locator('.theme-toggle');

        await expect(html).toHaveAttribute(
          'data-theme',
          'light',
          'Initial theme should be light.'
        );

        await themeToggle.click();
        await expect(html).toHaveAttribute(
          'data-theme',
          'dark',
          'Theme should toggle to dark.'
        );

        await themeToggle.click();
        await expect(html).toHaveAttribute(
          'data-theme',
          'light',
          'Theme should toggle back to light.'
        );
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
          const filterButton = page.locator(
            `.filter-btn[data-filter="${filter.category}"]`
          );
          await filterButton.click();

          await expect(filterButton).toHaveClass(
            /active/,
            `The ${filter.name} filter button should be active.`
          );

          const toolCards = page.locator('#tool-grid .tool-card');
          const allCards = await toolCards.all();

          for (const card of allCards) {
            const cardCategory = await card.getAttribute('data-category');
            if (filter.category === 'all' || cardCategory === filter.category) {
              await expect(card).toBeVisible();
            } else {
              await expect(card).toBeHidden();
            }
          }
        });
      }
    });

    test.describe('Carousel Navigation', () => {
      test('should navigate through the carousel using next and previous buttons', async ({
        page,
      }) => {
        const carousel = page.locator('#featured-tool-carousel');
        await expect(carousel).toBeVisible();

        const nextButton = carousel.locator('.carousel-control.next');
        const prevButton = carousel.locator('.carousel-control.prev');

        const initialActiveSlide = carousel.locator('.carousel-item.active');
        const initialToolId =
          await initialActiveSlide.getAttribute('data-tool-id');

        await nextButton.click();
        const activeSlideAfterNext = carousel.locator('.carousel-item.active');
        await expect(activeSlideAfterNext).not.toHaveAttribute(
          'data-tool-id',
          initialToolId
        );

        await prevButton.click();
        const activeSlideAfterPrev = carousel.locator('.carousel-item.active');
        await expect(activeSlideAfterPrev).toHaveAttribute(
          'data-tool-id',
          initialToolId
        );
      });
    });
  });
});
