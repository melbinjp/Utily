const fs = require('fs');
const { execSync } = require('child_process');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });
fs.mkdirSync('dist/js', { recursive: true });
fs.mkdirSync('dist/assets', { recursive: true });

console.log('🧹 Cleaned dist directory');

// Build CSS
try {
  execSync('npm run build:css', { stdio: 'inherit' });
  console.log('✅ CSS built successfully');
} catch (error) {
  console.error('❌ CSS build failed:', error.message);
}

// Build JS
try {
  execSync('npm run build:js', { stdio: 'inherit' });
  console.log('✅ JavaScript built successfully');
} catch (error) {
  console.error('❌ JavaScript build failed:', error.message);
}

// Copy files
const filesToCopy = [
  { src: 'index.html', dest: 'dist/index.html' },
  { src: 'tools.json', dest: 'dist/tools.json' },
  { src: 'js/shared.js', dest: 'dist/js/shared.js' },
  { src: 'js/sw-register.js', dest: 'dist/js/sw-register.js' },
  { src: 'sw.js', dest: 'dist/sw.js' },
  { src: 'privacy.html', dest: 'dist/privacy.html' },
  { src: 'terms.html', dest: 'dist/terms.html' },
  { src: 'contact.html', dest: 'dist/contact.html' },
];

filesToCopy.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`📄 Copied ${src} → ${dest}`);
  } else {
    console.warn(`⚠️  File not found: ${src}`);
  }
});

console.log('🎉 Build completed successfully!');
