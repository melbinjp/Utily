const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const util = require('util');
const zlib = require('zlib');
const brotli = require('brotli');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

const writeFile = util.promisify(fs.writeFile);
const gzip = util.promisify(zlib.gzip);

async function compressFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const content = fs.readFileSync(filePath);
    const gzipped = await gzip(content);
    const brotliCompressed = brotli.compress(content);
    await writeFile(`${filePath}.gz`, gzipped);
    await writeFile(`${filePath}.br`, brotliCompressed);
    console.log(`🔧 Compressed ${filePath}`);
  } catch (err) {
    console.warn(`⚠️  Failed to compress ${filePath}:`, err.message);
  }
}

async function optimizeImages() {
  try {
    const files = await imagemin(['assets/**/*.{jpg,png,svg}'], {
      destination: 'dist/assets/images',
      plugins: [
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
        imageminSvgo({
          plugins: [
            {
              name: 'preset-default',
              params: { overrides: { removeViewBox: false } },
            },
          ],
        }),
      ],
    });
    console.log('✨ Images optimized:', files.length || 0);
  } catch (err) {
    console.warn('⚠️  Image optimization failed:', err.message);
  }
}

async function build() {
  console.log('🧹 Cleaning dist directory');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/js', { recursive: true });
  fs.mkdirSync('dist/assets', { recursive: true });
  fs.mkdirSync('dist/assets/images', { recursive: true });

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
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
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
    await compressFile('dist/style.css');
  } catch (error) {
    console.error('❌ CSS build failed:', error.message);
  }

  // Build JS
  try {
    execSync('npm run build:js', { stdio: 'inherit' });
    console.log('✅ JavaScript built successfully');
    const jsFiles = fs.existsSync('dist/js') ? fs.readdirSync('dist/js') : [];
    for (const file of jsFiles) {
      await compressFile(path.join('dist/js', file));
    }
  } catch (error) {
    console.error('❌ JavaScript build failed:', error.message);
  }

  // Optimize images (best-effort)
  await optimizeImages();

  // Copy static files
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
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
