// Modern Icon System - SVG Sprites
class IconSystem {
  constructor() {
    this.spriteLoaded = false;
    this.loadSprite();
  }

  // Load SVG sprite into DOM
  async loadSprite() {
    try {
      const response = await fetch('assets/icons/sprite.svg');
      const svgText = await response.text();

      // Insert sprite at beginning of body
      const div = document.createElement('div');
      div.className = 'svg-sprite-container';
      div.innerHTML = svgText;
      document.body.insertBefore(div, document.body.firstChild);

      this.spriteLoaded = true;
      console.log('✅ Icon sprite loaded');
    } catch (error) {
      console.warn('⚠️ Icon sprite failed to load:', error);
    }
  }

  // Create icon element
  createIcon(name, className = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

    svg.setAttribute('class', `icon icon-${name} ${className}`.trim());
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', `#icon-${name}`);

    svg.appendChild(use);
    return svg;
  }

  // Replace FontAwesome icons with SVG sprites
  replaceFontAwesome() {
    const faIcons = document.querySelectorAll('[class*="fa-"]');

    faIcons.forEach((element) => {
      const classes = Array.from(element.classList);
      const faClass = classes.find((cls) => cls.startsWith('fa-'));

      if (faClass) {
        const iconName = faClass.replace('fa-', '');
        const svgIcon = this.createIcon(iconName);

        // Copy non-FA classes
        const otherClasses = classes.filter((cls) => !cls.startsWith('fa'));
        if (otherClasses.length > 0) {
          svgIcon.classList.add(...otherClasses);
        }

        element.parentNode.replaceChild(svgIcon, element);
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.iconSystem = new IconSystem();
  });
} else {
  window.iconSystem = new IconSystem();
}

export default IconSystem;
