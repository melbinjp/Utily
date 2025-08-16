const CACHE_NAME = 'wecanuseai-v2';
const urlsToCache = [
  './',
  'index.html',
  'style.css',
  'js/main.js',
  'js/AIToolsPortal.js',
  'js/Carousel.js',
  'js/utils.js',
  'tools.json',
  'site.webmanifest',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
