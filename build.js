const fs = require('fs');
const { execSync } = require('child_process');
const { glob } = require('glob');

async function build() {
  console.log('🧹 Cleaning dist directory');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/js', { recursive: true });
  fs.mkdirSync('dist/assets', { recursive: true });
  fs.mkdirSync('dist/assets/images', { recursive: true });
  fs.mkdirSync('dist/assets/fonts', { recursive: true });
  fs.mkdirSync('dist/assets/icons', { recursive: true });
  fs.mkdirSync('dist/assets/favicon', { recursive: true });
  fs.mkdirSync('dist/components', { recursive: true });

  // Copy .nojekyll if present
  if (fs.existsSync('.nojekyll')) {
    fs.copyFileSync('.nojekyll', 'dist/.nojekyll');
  }

  // Generate _headers file for GitHub Pages to set security headers
  const headers = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; object-src 'none'; base-uri 'none';
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/*.html
  Cache-Control: no-cache

/*.css
  Cache-Control: public, max-age=31536000

/*.js
  Cache-Control: public, max-age=31536000

/assets/*
  Cache-Control: public, max-age=31536000
`;
  fs.writeFileSync('dist/_headers', headers);

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

  // Build icons and subset FontAwesome
  try {
    execSync('npm run subset:fontawesome', { stdio: 'inherit' });
    execSync('npm run build:icons', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Icon or font subsetting failed:', error.message);
  }

  // Copy static files
  const filesToCopy = [
    { src: 'index.html', dest: 'dist/index.html' },
    { src: 'tools.json', dest: 'dist/tools.json' },
    { src: 'js/shared.js', dest: 'dist/js/shared.js' },
    { src: 'js/utils.js', dest: 'dist/js/utils.js' },
    { src: 'js/sw-register.js', dest: 'dist/js/sw-register.js' },
    { src: 'sw.js', dest: 'dist/sw.js' },
    { src: 'privacy.html', dest: 'dist/privacy.html' },
    { src: 'terms.html', dest: 'dist/terms.html' },
    { src: 'contact.html', dest: 'dist/contact.html' },
    { src: 'robots.txt', dest: 'dist/robots.txt' },
    { src: 'site.webmanifest', dest: 'dist/site.webmanifest' },
    { src: '.htaccess', dest: 'dist/.htaccess' },
    { src: 'CNAME', dest: 'dist/CNAME' },
    {
      src: 'assets/favicon/favicon.svg',
      dest: 'dist/assets/favicon/favicon.svg',
    },
    {
      src: 'assets/fonts/fontawesome.css',
      dest: 'dist/assets/fonts/fontawesome.css',
    },
    { src: 'components/header.html', dest: 'dist/components/header.html' },
  ];

  filesToCopy.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`📄 Copied ${src} → ${dest}`);
    } else {
      console.warn(`⚠️  File not found: ${src}`);
    }
  });

  // Copy font files from assets/fonts to dist/assets/fonts
  const fontFiles = await glob('assets/fonts/*.{woff2,woff,ttf,eot}');
  for (const file of fontFiles) {
    const destPath = `dist/${file}`;
    fs.copyFileSync(file, destPath);
    console.log(`📄 Copied ${file} → ${destPath}`);
  }

  console.log('🎉 Build completed successfully!');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
