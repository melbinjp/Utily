const fs = require('fs');
const glob = require('glob');

// Auto-extract FontAwesome icons from project files
function extractUsedIcons() {
  const files = glob.sync('**/*.{html,js,json}', { ignore: 'node_modules/**' });
  const iconRegex = /fa-[\w-]+/g;
  const usedIcons = new Set();
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(iconRegex);
    if (matches) {
      matches.forEach(icon => usedIcons.add(icon));
    }
  });
  
  return Array.from(usedIcons);
}

// Generate optimized FontAwesome CSS
function generateOptimizedCSS(icons) {
  // This would fetch Unicode values from FontAwesome metadata
  console.log('Used icons:', icons);
  console.log('Run: npm run build:icons');
}

if (require.main === module) {
  const icons = extractUsedIcons();
  generateOptimizedCSS(icons);
}

module.exports = { extractUsedIcons };