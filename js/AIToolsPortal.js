import { escapeHtml } from './utils.js';

/**
 * Manages the AI Tools Portal application.
 * Handles loading tools, rendering the UI, and user interactions like filtering and theme switching.
 */
export class AIToolsPortal {
  constructor() {
    this.tools = [];
    this.currentFilter = 'all';
    this._cacheSelectors();
    this.init();
  }

  /**
   * Caches frequently used DOM elements to avoid repeated queries.
   * @private
   */
  _cacheSelectors() {
    this.loadingIndicator = document.getElementById('loading-indicator');
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeIcon = document.querySelector('.theme-toggle .icon');
    this.toolGrid = document.getElementById('tool-grid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.heroCarousel = document.querySelector('.hero-carousel');
  }

  /**
   * Initializes the application by loading data and setting up UI components.
   */
  async init() {
    this.showLoading();

    try {
      await this.loadTools();
      this.renderToolGrid();
      this.hideLoading(); // Hide loading screen as soon as main content is rendered

      // Load secondary content after hiding the loader
      this.setupFilters();
      this.setupIntersectionObserver();
      await this.lazyLoadCarousel();
    } catch (error) {
      console.error('Failed to initialize portal:', error);
      this.showError('Failed to load AI tools. Please refresh the page.');
      // If an error happens before hideLoading is called, we still need to hide it.
      this.hideLoading();
    }
  }

  /**
   * Fetches the tool data from the `tools.json` file.
   * @throws {Error} If the network request fails.
   */
  async loadTools() {
    try {
      const response = await fetch('tools.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const allTools = await response.json();
      this.tools = allTools.filter((tool) => tool.show);
    } catch (error) {
      console.error('Failed to load tools:', error);
      this.tools = [];
      throw error;
    }
  }

  /**
   * Lazily loads and initializes the hero carousel for featured tools.
   */
  async lazyLoadCarousel() {
    const featuredTools = this.tools.filter((tool) => tool.featured);
    if (featuredTools.length > 0) {
      const { Carousel } = await import('./Carousel.js');
      new Carousel(featuredTools, this.heroCarousel);
    } else {
      this.heroCarousel?.remove();
    }
  }

  /**
   * Shows the main loading indicator.
   */
  showLoading() {
    this.loadingIndicator?.classList.remove('hidden');
  }

  /**
   * Hides the main loading indicator.
   */
  hideLoading() {
    this.loadingIndicator?.remove();
  }

  /**
   * Displays a full-screen error message.
   * @param {string} message - The error message to display.
   */
  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<div class="error-content"><i class="fas fa-exclamation-triangle"></i><p>${message}</p><button id="retry-button">Retry</button></div>`;
    document.body.appendChild(errorDiv);
    document.getElementById('retry-button').addEventListener('click', () => {
      location.reload();
    });
  }

  /**
   * Sets up the light/dark theme toggle button and loads the saved theme.
   */
  setupThemeToggle() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);

    this.themeToggle?.addEventListener('click', () => {
      const newTheme =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'light'
          : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.updateThemeIcon(newTheme);
    });
  }

  /**
   * Updates the theme toggle icon to reflect the current theme.
   * @param {string} theme - The current theme ('light' or 'dark').
   */
  updateThemeIcon(theme) {
    if (this.themeIcon) {
      const iconName = theme === 'dark' ? 'sun' : 'moon';
      const useElement = this.themeIcon.querySelector('use');
      if (useElement) {
        useElement.setAttribute('href', `#icon-${iconName}`);
      }
      this.themeIcon.setAttribute('class', `icon icon-${iconName}`);
    }
  }

  /**
   * Renders the grid of tool cards.
   */
  renderToolGrid() {
    if (!this.toolGrid) return;

    this.toolGrid.querySelector('.tool-placeholder')?.remove();
    this.toolGrid.innerHTML = '';

    this.tools.forEach((tool) => {
      this.toolGrid.appendChild(this.createToolCard(tool));
    });
  }

  /**
   * Creates an HTML element for a single tool card.
   * @param {object} tool - The tool data object.
   * @returns {HTMLElement} The created tool card element.
   */
  createToolCard(tool) {
    const card = document.createElement('article');
    card.className = 'tool-card';
    card.dataset.category = tool.category || 'utility';
    card.style.minHeight = '200px';

    const iconName = tool.icon.replace(/fa[sb]? fa-/, '');
    const template = document.createElement('template');
    template.innerHTML = `
            <div class="tool-card-header">
                <div class="tool-card-icon"><svg class="icon icon-${iconName}" aria-hidden="true"><use href="#icon-${iconName}"></use></svg></div>
                <h3><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.title)}</a></h3>
            </div>
            <p>${escapeHtml(tool.description)}</p>
            <div class="tool-card-footer">
                <a href="${tool.url}" class="tool-card-link" target="_blank" rel="noopener noreferrer">Try it out <span class="sr-only">for ${escapeHtml(tool.title)}</span><svg class="icon icon-external-link-alt" aria-hidden="true"><use href="#icon-external-link-alt"></use></svg></a>
            </div>`;

    card.appendChild(template.content.cloneNode(true));
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        window.open(tool.url, '_blank', 'noopener,noreferrer');
      }
    });

    return card;
  }

  /**
   * Sets up the event listeners for the category filter buttons.
   */
  setupFilters() {
    this.filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.setActiveFilter(filter);
        this.filterTools(filter);
      });
    });
  }

  /**
   * Sets the visual 'active' state on a filter button.
   * @param {string} filter - The filter to set as active.
   */
  setActiveFilter(filter) {
    this.filterButtons.forEach((btn) => btn.classList.remove('active'));
    document
      .querySelector(`[data-filter="${filter}"]`)
      ?.classList.add('active');
    this.currentFilter = filter;
  }

  /**
   * Filters the displayed tool cards based on the selected category.
   * @param {string} filter - The category to show ('all', 'ai', 'media', 'utility').
   */
  filterTools(filter) {
    document.querySelectorAll('.tool-card').forEach((card) => {
      const category = card.dataset.category;
      card.classList.toggle(
        'hidden',
        !(filter === 'all' || category === filter)
      );
    });
  }

  /**
   * Sets up an Intersection Observer to apply animations to tool cards as they scroll into view.
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fade-in-up 0.6s ease forwards';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document
      .querySelectorAll('.tool-card')
      .forEach((card) => observer.observe(card));
  }
}
