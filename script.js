class AIToolsPortal {
    constructor() {
        this.tools = [];
        this.featuredTools = [];
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.currentFilter = 'all';
        this.isLoading = true;
        
        this.init();
    }
    
    async init() {
        this.showLoading();
        this.setupThemeToggle();
        this.setupKeyboardNavigation();
        
        try {
            await this.loadTools();
            this.renderFeaturedTools();
            this.renderToolGrid();
            this.setupCarousel();
            this.setupFilters();
            this.setupIntersectionObserver();
        } catch (error) {
            console.error('Failed to initialize portal:', error);
            this.showError('Failed to load AI tools. Please refresh the page.');
        } finally {
            this.hideLoading();
        }
    }
    
    async loadTools() {
        const response = await fetch('tools.json');
        if (!response.ok) throw new Error('Failed to fetch tools');
        
        const allTools = await response.json();
        this.tools = allTools.filter(tool => tool.show);
        this.featuredTools = this.tools.filter(tool => tool.featured);
    }
    
    showLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) loader.classList.remove('hidden');
    }
    
    hideLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
                <button onclick="location.reload()">Retry</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }
    
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(currentTheme);
        
        themeToggle?.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
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
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.target.matches('input, textarea, select')) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Escape':
                    this.pauseAutoplay();
                    break;
            }
        });
    }
    
    renderFeaturedTools() {
        const carouselInner = document.querySelector('.carousel-inner');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        if (!carouselInner || !indicatorsContainer) return;
        
        carouselInner.innerHTML = '';
        indicatorsContainer.innerHTML = '';
        
        this.featuredTools.forEach((tool, index) => {
            const carouselItem = this.createCarouselItem(tool, index);
            carouselInner.appendChild(carouselItem);
            
            const indicator = this.createIndicator(index);
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    createCarouselItem(tool, index) {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.setAttribute('role', 'tabpanel');
        item.setAttribute('aria-label', `Featured tool ${index + 1}: ${tool.title}`);
        
        if (tool.background_image) {
            item.style.backgroundImage = `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.9) 100%), url(${tool.background_image})`;
            item.style.backgroundSize = 'cover';
            item.style.backgroundPosition = 'center';
        }
        
        item.innerHTML = `
            <div class="featured-content">
                <div class="featured-text">
                    <h2><i class="fas fa-rocket" aria-hidden="true"></i> Featured Tool</h2>
                    <h3>${this.escapeHtml(tool.title)}</h3>
                    <p>${this.escapeHtml(tool.featured_description || tool.description)}</p>
                    <div class="featured-actions">
                        <a href="${tool.url}" class="primary-btn" target="_blank" rel="noopener noreferrer" aria-label="Try ${tool.title}">
                            <span>Try it now</span>
                            <i class="fas fa-arrow-right" aria-hidden="true"></i>
                        </a>
                        <a href="#main-content" class="secondary-btn">Explore all tools</a>
                    </div>
                </div>
                <div class="featured-visual">
                    <div class="floating-card">
                        <div class="card-icon">
                            <i class="${tool.icon}" aria-hidden="true"></i>
                        </div>
                        <div class="card-content">
                            <h4>${this.escapeHtml(tool.title)}</h4>
                            <p>AI-Powered Tool</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return item;
    }
    
    createIndicator(index) {
        const indicator = document.createElement('button');
        indicator.className = 'indicator';
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicator.dataset.index = index;
        
        indicator.addEventListener('click', () => {
            this.goToSlide(index);
        });
        
        return indicator;
    }
    
    renderToolGrid() {
        const toolGrid = document.getElementById('tool-grid');
        if (!toolGrid) return;
        
        toolGrid.innerHTML = '';
        
        this.tools.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            toolGrid.appendChild(toolCard);
        });
    }
    
    createToolCard(tool) {
        const card = document.createElement('article');
        card.className = 'tool-card';
        card.dataset.category = this.getToolCategory(tool);
        
        card.innerHTML = `
            <div class="tool-card-header">
                <div class="tool-card-icon">
                    <i class="${tool.icon}" aria-hidden="true"></i>
                </div>
                <h3>
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${tool.title}">
                        ${this.escapeHtml(tool.title)}
                    </a>
                </h3>
            </div>
            <p>${this.escapeHtml(tool.description)}</p>
            <div class="tool-card-footer">
                <a href="${tool.url}" class="tool-card-link" target="_blank" rel="noopener noreferrer">
                    Try it out
                    <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                </a>
            </div>
        `;
        
        // Add click handler for the entire card
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
        
        if (title.includes('chat') || title.includes('ai') || description.includes('ai') || description.includes('transcription')) {
            return 'ai';
        }
        if (title.includes('audio') || title.includes('video') || title.includes('3d') || title.includes('voice')) {
            return 'media';
        }
        return 'utility';
    }
    
    setupCarousel() {
        if (this.featuredTools.length === 0) return;
        
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        
        prevButton?.addEventListener('click', () => this.previousSlide());
        nextButton?.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support
        this.setupTouchNavigation();
        
        // Pause autoplay on hover
        const carousel = document.querySelector('.carousel');
        carousel?.addEventListener('mouseenter', () => this.pauseAutoplay());
        carousel?.addEventListener('mouseleave', () => this.resumeAutoplay());
        
        // Pause autoplay when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
        
        this.updateCarousel();
        this.startAutoplay();
    }
    
    setupTouchNavigation() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;
        
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            // Prevent vertical scrolling if horizontal swipe is detected
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.changedTouches[0].clientX - startX;
            const threshold = 50;
            
            if (Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }
    
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.setActiveFilter(filter);
                this.filterTools(filter);
            });
        });
    }
    
    setActiveFilter(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
        this.currentFilter = filter;
    }
    
    filterTools(filter) {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.3s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.tool-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.indicator');
        
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
            item.setAttribute('aria-hidden', index !== this.currentIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
            indicator.setAttribute('aria-selected', index === this.currentIndex);
        });
        
        const carouselInner = document.querySelector('.carousel-inner');
        if (carouselInner) {
            carouselInner.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.featuredTools.length;
        this.updateCarousel();
        this.resetAutoplay();
    }
    
    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.featuredTools.length) % this.featuredTools.length;
        this.updateCarousel();
        this.resetAutoplay();
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoplay();
    }
    
    startAutoplay() {
        if (this.featuredTools.length <= 1) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (!this.autoplayInterval && this.featuredTools.length > 1) {
            this.startAutoplay();
        }
    }
    
    resetAutoplay() {
        this.pauseAutoplay();
        this.resumeAutoplay();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the portal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIToolsPortal();
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .error-message {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        color: white;
        text-align: center;
    }
    
    .error-content {
        background: #dc3545;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 400px;
    }
    
    .error-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .error-content button {
        background: white;
        color: #dc3545;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;
        margin-top: 1rem;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
