import { AIToolsPortal } from './AIToolsPortal.js';

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
document.addEventListener('DOMContentLoaded', startApp, { passive: true });
