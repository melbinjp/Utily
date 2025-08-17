import { escapeHtml } from './utils.js';

export class AIToolsPortal {
  constructor() {
    this.tools = [];
    this.currentFilter = 'all';
    this.init();
  }

  async init() {
    this.showLoading();
    this.setupThemeToggle();

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

  async lazyLoadCarousel() {
    const featuredTools = this.tools.filter((tool) => tool.featured);
    if (featuredTools.length > 0) {
      const { Carousel } = await import('./Carousel.js');
      new Carousel(featuredTools, document.querySelector('.hero-carousel'));
    } else {
      document.querySelector('.hero-carousel')?.remove();
    }
  }

  showLoading() {
    document.getElementById('loading-indicator')?.classList.remove('hidden');
  }

  hideLoading() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
      loader.remove();
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<div class="error-content"><i class="fas fa-exclamation-triangle"></i><p>${message}</p><button onclick="location.reload()">Retry</button></div>`;
    document.body.appendChild(errorDiv);
  }

  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);

    themeToggle?.addEventListener('click', () => {
      const newTheme =
        document.documentElement.getAttribute('data-theme') === 'dark'
          ? 'light'
          : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.updateThemeIcon(newTheme);
    });
  }

  updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  renderToolGrid() {
    const toolGrid = document.getElementById('tool-grid');
    if (!toolGrid) return;

    toolGrid.querySelector('.tool-placeholder')?.remove();
    toolGrid.innerHTML = '';

    this.tools.forEach((tool) => {
      toolGrid.appendChild(this.createToolCard(tool));
    });
  }

  createToolCard(tool) {
    const card = document.createElement('article');
    card.className = 'tool-card';
    card.dataset.category = this.getToolCategory(tool);
    card.style.minHeight = '200px';

    const template = document.createElement('template');
    template.innerHTML = `
            <div class="tool-card-header">
                <div class="tool-card-icon"><i class="${tool.icon}" aria-hidden="true"></i></div>
                <h3><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool.title)}</a></h3>
            </div>
            <p>${escapeHtml(tool.description)}</p>
            <div class="tool-card-footer">
                <a href="${tool.url}" class="tool-card-link" target="_blank" rel="noopener noreferrer">Try it out <span class="sr-only">for ${escapeHtml(tool.title)}</span><i class="fas fa-external-link-alt" aria-hidden="true"></i></a>
            </div>`;

    card.appendChild(template.content.cloneNode(true));
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) {
        window.open(tool.url, '_blank', 'noopener,noreferrer');
      }
    });

    return card;
  }

  getToolCategory(tool) {
    const title = tool.title.toLowerCase();
    const description = tool.description.toLowerCase();
    if (
      title.includes('chat') ||
      title.includes('ai') ||
      description.includes('ai') ||
      description.includes('transcription')
    )
      return 'ai';
    if (
      title.includes('audio') ||
      title.includes('video') ||
      title.includes('3d') ||
      title.includes('voice')
    )
      return 'media';
    return 'utility';
  }

  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.setActiveFilter(filter);
        this.filterTools(filter);
      });
    });
  }

  setActiveFilter(filter) {
    document
      .querySelectorAll('.filter-btn')
      .forEach((btn) => btn.classList.remove('active'));
    document
      .querySelector(`[data-filter="${filter}"]`)
      ?.classList.add('active');
    this.currentFilter = filter;
  }

  filterTools(filter) {
    document.querySelectorAll('.tool-card').forEach((card) => {
      const category = card.dataset.category;
      card.classList.toggle(
        'hidden',
        !(filter === 'all' || category === filter)
      );
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
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
