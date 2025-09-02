import { escapeHtml } from './utils.js';

/**
 * Represents a UI carousel for displaying featured content.
 * Handles rendering, navigation (autoplay, manual, keyboard, touch), and accessibility.
 */
export class Carousel {
  /**
   * Creates an instance of Carousel.
   * @param {object[]} featuredTools - An array of tool objects to display in the carousel.
   * @param {HTMLElement} carouselContainer - The main container element for the carousel.
   */
  constructor(featuredTools, carouselContainer) {
    this.featuredTools = featuredTools;
    this.container = carouselContainer;
    this.inner = this.container.querySelector('.carousel-inner');
    this.indicatorsContainer = this.container.querySelector(
      '.carousel-indicators'
    );
    this.currentIndex = 0;
    this.autoplayInterval = null;

    if (
      !this.inner ||
      !this.indicatorsContainer ||
      this.featuredTools.length === 0
    ) {
      return;
    }

    this.render();
    this.setupEventListeners();
    this.startAutoplay();
  }

  /**
   * Renders the carousel items and indicators.
   */
  render() {
    // Remove placeholder and show controls
    const placeholder = this.inner.querySelector('.carousel-placeholder');
    if (placeholder) placeholder.remove();
    this.container
      .querySelectorAll('.carousel-control')
      .forEach((control) => (control.style.opacity = '1'));

    this.inner.innerHTML = '';
    this.indicatorsContainer.innerHTML = '';

    this.featuredTools.forEach((tool, index) => {
      this.inner.appendChild(this.createCarouselItem(tool));
      this.indicatorsContainer.appendChild(this.createIndicator(index));
    });

    this.update();
  }

  /**
   * Creates a single carousel item element.
   * @param {object} tool - The tool data object for the item.
   * @returns {HTMLElement} The created carousel item element.
   * @private
   */
  createCarouselItem(tool) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.setAttribute('role', 'tabpanel');
    item.setAttribute('aria-label', `Featured tool: ${tool.title}`);

    // Always set the gradient as a fallback
    item.style.backgroundImage = `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.9) 100%)`;
    item.style.backgroundSize = 'cover';
    item.style.backgroundPosition = 'center';

    if (tool.background_image) {
      const img = new Image();
      img.onload = () => {
        item.style.backgroundImage = `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.9) 100%), url(${tool.background_image})`;
      };
      img.onerror = () => {
        console.warn(`Carousel image failed to load: ${tool.background_image}`);
      };
      img.src = tool.background_image;
    }

    item.innerHTML = `
            <div class="featured-content">
                <div class="featured-text">
                    <h2><i class="fas fa-rocket" aria-hidden="true"></i> Featured Tool</h2>
                    <h3>${escapeHtml(tool.title)}</h3>
                    <p>${escapeHtml(tool.featured_description || tool.description)}</p>
                    <div class="featured-actions">
                        <a href="${tool.url}" class="primary-btn" target="_blank" rel="noopener noreferrer" aria-label="Try it now: ${tool.title}">
                            <span>Try it now</span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                        <a href="#main-content" class="secondary-btn">Explore all tools</a>
                    </div>
                </div>
                <div class="featured-visual">
                    <div class="floating-card">
                        <div class="card-icon"><i class="${tool.icon}" aria-hidden="true"></i></div>
                        <div class="card-content">
                            <h4>${escapeHtml(tool.title)}</h4>
                            <p>AI-Powered Tool</p>
                        </div>
                    </div>
                </div>
            </div>`;
    return item;
  }

  /**
   * Creates a single indicator button element.
   * @param {number} index - The index of the slide the indicator corresponds to.
   * @returns {HTMLElement} The created indicator element.
   * @private
   */
  createIndicator(index) {
    const indicator = document.createElement('button');
    indicator.className = 'indicator';
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
    indicator.dataset.index = index;
    indicator.addEventListener('click', () => this.goToSlide(index));
    return indicator;
  }

  /**
   * Sets up all event listeners for carousel interactions.
   * @private
   */
  setupEventListeners() {
    this.container
      .querySelector('.carousel-control.prev')
      ?.addEventListener('click', () => this.previousSlide());
    this.container
      .querySelector('.carousel-control.next')
      ?.addEventListener('click', () => this.nextSlide());
    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
    document.addEventListener('visibilitychange', () =>
      document.hidden ? this.pauseAutoplay() : this.resumeAutoplay()
    );
    this.setupKeyboardNavigation();
    this.setupTouchNavigation();
  }

  /**
   * Sets up keyboard navigation (left/right arrows).
   * @private
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.previousSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
      }
    });
  }

  /**
   * Sets up touch/swipe navigation.
   * @private
   */
  setupTouchNavigation() {
    let startX = 0;
    let isDragging = false;
    this.container.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
      },
      { passive: true }
    );

    this.container.addEventListener(
      'touchend',
      (e) => {
        if (!isDragging) return;
        const deltaX = e.changedTouches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
          deltaX > 0 ? this.previousSlide() : this.nextSlide();
        }
        isDragging = false;
      },
      { passive: true }
    );
  }

  /**
   * Updates the carousel's visual state to reflect the current index.
   * Manages active classes, ARIA attributes, and focusability.
   */
  update() {
    this.inner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.container.querySelectorAll('.carousel-item').forEach((item, index) => {
      const isActive = index === this.currentIndex;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-hidden', !isActive);

      const focusableElements = item.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements.forEach((el) => {
        if (isActive) {
          el.removeAttribute('tabindex');
        } else {
          el.setAttribute('tabindex', '-1');
        }
      });
    });
    this.container
      .querySelectorAll('.indicator')
      .forEach((indicator, index) => {
        indicator.classList.toggle('active', index === this.currentIndex);
        indicator.setAttribute('aria-selected', index === this.currentIndex);
      });
  }

  /**
   * Navigates to the next slide.
   */
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.featuredTools.length;
    this.update();
    this.resetAutoplay();
  }

  /**
   * Navigates to the previous slide.
   */
  previousSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.featuredTools.length) %
      this.featuredTools.length;
    this.update();
    this.resetAutoplay();
  }

  /**
   * Navigates to a specific slide by its index.
   * @param {number} index - The index of the slide to go to.
   */
  goToSlide(index) {
    this.currentIndex = index;
    this.update();
    this.resetAutoplay();
  }

  /**
   * Starts the autoplay interval.
   * @private
   */
  startAutoplay() {
    if (this.featuredTools.length <= 1) return;
    this.autoplayInterval = setInterval(() => this.nextSlide(), 6000);
  }

  /**
   * Pauses the autoplay interval.
   */
  pauseAutoplay() {
    clearInterval(this.autoplayInterval);
    this.autoplayInterval = null;
  }

  /**
   * Resumes autoplay if it has been paused.
   */
  resumeAutoplay() {
    if (!this.autoplayInterval) this.startAutoplay();
  }

  /**
   * Resets the autoplay timer by pausing and resuming it.
   * @private
   */
  resetAutoplay() {
    this.pauseAutoplay();
    this.resumeAutoplay();
  }
}
