const CACHE_NAME = 'wecanuseai-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './js/main.js',
  './tools.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
