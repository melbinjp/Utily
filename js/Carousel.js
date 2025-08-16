import { escapeHtml } from './utils.js';

export class Carousel {
    constructor(featuredTools, carouselContainer) {
        this.featuredTools = featuredTools;
        this.container = carouselContainer;
        this.inner = this.container.querySelector('.carousel-inner');
        this.indicatorsContainer = this.container.querySelector('.carousel-indicators');
        this.currentIndex = 0;
        this.autoplayInterval = null;

        if (!this.inner || !this.indicatorsContainer || this.featuredTools.length === 0) {
            return;
        }

        this.render();
        this.setupEventListeners();
        this.startAutoplay();
    }

    render() {
        // Remove placeholder and show controls
        const placeholder = this.inner.querySelector('.carousel-placeholder');
        if (placeholder) placeholder.remove();
        this.container.querySelectorAll('.carousel-control').forEach(control => control.style.opacity = '1');

        this.inner.innerHTML = '';
        this.indicatorsContainer.innerHTML = '';

        this.featuredTools.forEach((tool, index) => {
            this.inner.appendChild(this.createCarouselItem(tool, index));
            this.indicatorsContainer.appendChild(this.createIndicator(index));
        });

        this.update();
    }

    createCarouselItem(tool, index) {
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

    createIndicator(index) {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicator.dataset.index = index;
        indicator.addEventListener('click', () => this.goToSlide(index));
        return indicator;
    }

    setupEventListeners() {
        this.container.querySelector('.carousel-control.prev')?.addEventListener('click', () => this.previousSlide());
        this.container.querySelector('.carousel-control.next')?.addEventListener('click', () => this.nextSlide());
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.resumeAutoplay());
        document.addEventListener('visibilitychange', () => document.hidden ? this.pauseAutoplay() : this.resumeAutoplay());
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
    }

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

    setupTouchNavigation() {
        let startX = 0;
        let isDragging = false;
        this.container.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.container.addEventListener('touchend', e => {
            if (!isDragging) return;
            const deltaX = e.changedTouches[0].clientX - startX;
            if (Math.abs(deltaX) > 50) {
                deltaX > 0 ? this.previousSlide() : this.nextSlide();
            }
            isDragging = false;
        }, { passive: true });
    }

    update() {
        this.inner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.container.querySelectorAll('.carousel-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
            item.setAttribute('aria-hidden', index !== this.currentIndex);
        });
        this.container.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
            indicator.setAttribute('aria-selected', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.featuredTools.length;
        this.update();
        this.resetAutoplay();
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.featuredTools.length) % this.featuredTools.length;
        this.update();
        this.resetAutoplay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.update();
        this.resetAutoplay();
    }

    startAutoplay() {
        if (this.featuredTools.length <= 1) return;
        this.autoplayInterval = setInterval(() => this.nextSlide(), 6000);
    }

    pauseAutoplay() {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
    }

    resumeAutoplay() {
        if (!this.autoplayInterval) this.startAutoplay();
    }

    resetAutoplay() {
        this.pauseAutoplay();
        this.resumeAutoplay();
    }
}
