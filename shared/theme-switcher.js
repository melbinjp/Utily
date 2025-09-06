// Reusable Theme Switcher Component
class ThemeSwitcher {
  constructor(options = {}) {
    this.storageKey = options.storageKey || 'theme';
    this.defaultTheme = options.defaultTheme || 'light';
    this.toggleSelector = options.toggleSelector || '.theme-toggle';
    this.iconSelector = options.iconSelector || '.theme-toggle i';
    
    this.init();
  }

  init() {
    // Set initial theme
    const savedTheme = localStorage.getItem(this.storageKey) || this.defaultTheme;
    this.setTheme(savedTheme);
    
    // Add event listeners
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest(this.toggleSelector)) {
        this.toggle();
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    this.updateIcon(theme);
  }

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || this.defaultTheme;
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateIcon(theme) {
    const icon = document.querySelector(this.iconSelector);
    if (icon) {
      icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
  }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
  });
} else {
  window.themeSwitcher = new ThemeSwitcher();
}

export default ThemeSwitcher;