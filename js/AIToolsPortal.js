import { escapeHtml } from './utils.js';

/**
 * Manages the AI Tools Portal application.
 * Handles loading tools, rendering the UI, and user interactions like filtering and theme switching.
 */
export class AIToolsPortal {
  constructor() {
    this.tools = [];
    this.currentFilter = 'all';
    this.visibleTools = new Set();
    this.observer = null;
    this._cacheSelectors();
    this._setupIntersectionObserver();
    this.init();
  }

  /**
   * Sets up IntersectionObserver for lazy loading
   * @private
   */
  _setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const toolId = entry.target.dataset.toolId;
            if (toolId && !this.visibleTools.has(toolId)) {
              this.visibleTools.add(toolId);
              this._renderTool(this.tools.find((t) => t.id === toolId));
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
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
      // If an error happens before hideLoading is called, we still need to hide it.
      this.hideLoading();
      this.showError('Failed to load AI tools. Please refresh the page.');
    }
  }

  /**
   * Fetches the tool data from the `tools.json` file.
   * @throws {Error} If the network request fails.
   */
  async loadTools() {
    try {
      // Update path to be relative to the current location
      const response = await fetch('./tools.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allTools = await response.json();
      if (!Array.isArray(allTools)) {
        throw new Error('Invalid tools data format');
      }
      // Show all tools in development
      this.tools =
        process.env.NODE_ENV === 'development'
          ? allTools
          : allTools.filter((tool) => tool.show);
      if (this.tools.length === 0) {
        throw new Error('No tools available');
      }
    } catch (error) {
      console.error('Failed to load tools:', error);
      this.tools = [];
      throw new Error('Failed to load AI tools data');
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
   * @returns {Promise<void>} A promise that resolves when the error message is added to the DOM
   */
  showError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
      <div class="error-content">
        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
        <p>${message}</p>
        <button id="retry-button" class="retry-button">Retry</button>
      </div>`;

    document.body.appendChild(errorDiv);

    const retryButton = document.getElementById('retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        location.reload();
      });
    }
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
                <h2><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.title)}</a></h2>
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
