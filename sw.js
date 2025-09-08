const CACHE_NAME = 'wecanuseai-v4';
const STATIC_CACHE = 'static-v4';
const DYNAMIC_CACHE = 'dynamic-v4';
const API_CACHE = 'api-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/main.js',
  './js/shared.js',
  './js/AIToolsPortal.js',
  './js/Carousel.js',
  './js/utils.js',
  './js/sw-register.js',
  './tools.json',
  './assets/icons/sprite.svg',
  './assets/fonts/fa-brands-400.woff2',
  './assets/fonts/fa-solid-900.woff2',
  './components/header.html',
];

// Cache static assets during installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (![STATIC_CACHE, DYNAMIC_CACHE].includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// Network-first strategy for API requests, Cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API requests: Network first, cache fallback
  if (url.pathname.includes('tools.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(event.request, clonedResponse));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: Cache first, network fallback
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
    return;
  }

  // Default: Network first with dynamic caching
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clonedResponse = response.clone();
        caches.open(DYNAMIC_CACHE)
          .then(cache => cache.put(event.request, clonedResponse));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
