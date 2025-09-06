// Shared components for all pages
const SITE_CONFIG = {
  siteName: 'WeCanUseAI',
  tagline: 'Empowering creativity with AI',
  faviconBase: 'https://favicon.wecanuseai.com',
  version: '1.0.0',
};

// Insert favicons into head
function insertFavicons() {
  const head = document.head;
  const favicons = `
    <link rel="icon" href="${SITE_CONFIG.faviconBase}/favicon.svg?v=${SITE_CONFIG.version}" type="image/svg+xml" sizes="any" />
    <link rel="icon" href="${SITE_CONFIG.faviconBase}/favicon-32.png?v=${SITE_CONFIG.version}" sizes="32x32" type="image/png" />
    <link rel="shortcut icon" href="${SITE_CONFIG.faviconBase}/favicon.ico?v=${SITE_CONFIG.version}" />
  `;
  head.insertAdjacentHTML('beforeend', favicons);
}

// Load header from component file
async function loadHeader() {
  const headerPlaceholder = document.querySelector('[data-include="header"]');
  if (headerPlaceholder) {
    try {
      const response = await fetch('components/header.html');
      if (response.ok) {
        const headerHTML = await response.text();
        headerPlaceholder.outerHTML = headerHTML;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.warn('Could not load header component:', error);
      // Fallback to inline header
      headerPlaceholder.outerHTML = `
        <header role="banner">
          <nav class="header-nav" role="navigation" aria-label="Main navigation">
            <h1 class="site-logo">
              <a href="/">
                <svg class="icon icon-logo" aria-hidden="true"><use href="#icon-logo"></use></svg>
                wecanuseai.com
              </a>
            </h1>
            <div class="header-actions">
              <button class="theme-toggle" aria-label="Toggle theme mode" title="Theme: System/Light/Dark">
                <svg class="icon icon-moon" aria-hidden="true"><use href="#icon-moon"></use></svg>
              </button>
            </div>
          </nav>
        </header>
      `;
    }
  }

  // Always initialize theme toggle
  initializeThemeToggle();
}

// Initialize theme toggle functionality
function initializeThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle && !themeToggle.hasAttribute('data-initialized')) {
    themeToggle.setAttribute('data-initialized', 'true');
    const html = document.documentElement;

    // Set initial theme immediately to prevent flash
    const savedMode = localStorage.getItem('themeMode') || 'system';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const actualTheme = savedMode === 'system' ? systemTheme : savedMode;
    html.setAttribute('data-theme', actualTheme);
    updateThemeIcon(savedMode, actualTheme);

    // Listen for system theme changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (localStorage.getItem('themeMode') === 'system') {
          applyTheme('system');
        }
      });

    themeToggle.addEventListener('click', () => {
      const currentMode = localStorage.getItem('themeMode') || 'system';
      let nextMode;

      if (currentMode === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        nextMode = systemTheme === 'dark' ? 'light' : 'dark';
      } else {
        nextMode = 'system';
      }

      localStorage.setItem('themeMode', nextMode);
      applyTheme(nextMode);
    });
  }
}

// Apply theme based on mode
function applyTheme(mode) {
  const html = document.documentElement;

  // Temporarily disable transitions for instant switch
  document.body.classList.add('theme-switching');

  const actualTheme =
    mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : mode;

  html.setAttribute('data-theme', actualTheme);
  updateThemeIcon(mode, actualTheme);

  // Re-enable transitions after a frame
  requestAnimationFrame(() => {
    document.body.classList.remove('theme-switching');
  });
}

// Update theme icon
function updateThemeIcon(mode, actualTheme) {
  const icon = document.querySelector('.theme-toggle .icon');
  if (icon) {
    let iconName;
    if (mode === 'system') {
      iconName = 'desktop';
    } else if (mode === 'light') {
      iconName = 'sun';
    } else {
      iconName = 'moon';
    }

    const useElement = icon.querySelector('use');
    if (useElement) {
      useElement.setAttribute('href', `#icon-${iconName}`);
    }
    icon.setAttribute('class', `icon icon-${iconName}`);
  }
}

// Insert or enhance footer
function insertFooter() {
  const footer = document.querySelector('footer[role="contentinfo"]');

  // If footer is empty (legal pages), insert full footer
  if (
    footer &&
    footer.innerHTML.trim() === '<!-- Footer loaded by shared.js -->'
  ) {
    footer.innerHTML = `
      <div class="footer-content">
        <p>&copy; <span class="copyright-year"></span> ${SITE_CONFIG.siteName}. ${SITE_CONFIG.tagline}.</p>
        <div class="footer-links">
          <a href="/">Home</a>
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    `;
  }

  // Always update copyright year (works on all pages)
  const copyrightSpan = document.querySelector('.copyright-year');
  if (copyrightSpan) {
    copyrightSpan.textContent = new Date().getFullYear();
  }
}

// Load SVG sprite for all pages
function loadSVGSprite() {
  const div = document.createElement('div');
  div.className = 'svg-sprite-container';
  div.innerHTML = `<svg class="svg-sprite"><defs>
    <symbol id="icon-logo" viewBox="0 0 24 24"><image href="https://favicon.wecanuseai.com/favicon.svg" width="24" height="24"/></symbol>
    <symbol id="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/></symbol>
    <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-chevron-left" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-chevron-right" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/><polyline points="12,5 19,12 12,19" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-external-link-alt" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="15,3 21,3 21,9" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-comments" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-microphone" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-cube" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="3.27,6.96 12,12.01 20.73,6.96" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-closed-captioning" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 21h8" stroke="currentColor" stroke-width="2"/><path d="M12 17v4" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-youtube" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/></symbol>
    <symbol id="icon-video" viewBox="0 0 24 24"><polygon points="23,7 16,12 23,17" fill="currentColor"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-image" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/></symbol>
    <symbol id="icon-desktop" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-code-branch" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="15" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="3" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="icon-star" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor"/></symbol>
  </defs></svg>`;
  document.body.insertBefore(div, document.body.firstChild);
}

// Initialize shared components
document.addEventListener('DOMContentLoaded', async () => {
  loadSVGSprite();
  insertFavicons();
  await loadHeader();
  insertFooter();
});
