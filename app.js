document.addEventListener('DOMContentLoaded', function() {
    // Load tools and render content
    loadTools();
    
    // Theme management
    initTheme();
    
    // Mobile menu
    initMobileMenu();
    
    // Smooth scrolling
    initSmoothScrolling();
});

async function loadTools() {
    try {
        const response = await fetch('tools.json');
        const tools = await response.json();
        
        const visibleTools = tools.filter(tool => tool.show);
        const featuredTool = visibleTools.find(tool => tool.featured);
        
        if (featuredTool) {
            renderFeaturedSection(featuredTool);
        }
        
        renderToolsGrid(visibleTools);
    } catch (error) {
        console.error('Error loading tools:', error);
    }
}

function renderFeaturedSection(tool) {
    const featuredSection = document.getElementById('featured-section');
    featuredSection.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-indigo-900 bg-opacity-30 text-primary border border-indigo-700">
                    <i class="fas fa-rocket mr-2"></i>
                    <span>Featured Tool</span>
                </div>
                <h2 class="mt-4 text-3xl md:text-4xl font-bold">${tool.title}</h2>
                <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
                    ${tool.featured_description || tool.description}
                </p>
                <div class="mt-8">
                    <a href="${tool.url}" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition" target="_blank">
                        Try it now
                        <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                    <a href="#tools" class="ml-4 inline-flex items-center px-6 py-3 bg-white bg-opacity-10 text-white font-medium rounded-lg hover:bg-opacity-20 transition border border-gray-700">
                        Explore all tools
                    </a>
                </div>
            </div>
        </div>
    `;
}

function renderToolsGrid(tools) {
    const toolsGrid = document.getElementById('tools-grid');
    toolsGrid.innerHTML = tools.map(tool => `
        <div class="tool-card rounded-2xl overflow-hidden">
            <div class="p-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold">${tool.title}</h3>
                        <p class="mt-2 text-gray-300">${tool.description}</p>
                    </div>
                    <div class="bg-indigo-900 bg-opacity-30 p-3 rounded-lg">
                        <i class="fas ${tool.icon} text-primary text-xl"></i>
                    </div>
                </div>
                <div class="mt-6">
                    <a href="${tool.url}" class="inline-flex items-center text-primary font-medium hover:underline" target="_blank">
                        ${tool.url.includes('youtube') ? 'Visit channel' : 'Try now'}
                        <i class="fas fa-arrow-right ml-2 text-sm"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            mobileThemeToggle.textContent = 'Light Mode';
        } else {
            document.documentElement.classList.remove('dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            mobileThemeToggle.textContent = 'Dark Mode';
        }
        localStorage.setItem('theme', theme);
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }
    
    applyTheme(initialTheme);
    themeToggle.addEventListener('click', toggleTheme);
    mobileThemeToggle.addEventListener('click', toggleTheme);
}

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}