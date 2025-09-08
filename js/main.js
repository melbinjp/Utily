import { AIToolsPortal } from './AIToolsPortal.js';

// Load the main stylesheet asynchronously
const loadCSS = () => {
  const stylesheet = document.getElementById('main-stylesheet');
  if (stylesheet) {
    stylesheet.media = 'all';
  }
};

// Use requestIdleCallback for non-critical initialization
const startApp = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      new AIToolsPortal();
    });
  } else {
    setTimeout(() => {
      new AIToolsPortal();
    }, 1);
  }
};

// Use passive event listeners where possible
document.addEventListener('DOMContentLoaded', () => {
  loadCSS();
  startApp();
}, { passive: true });
