const CACHE = 'v5';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  'manifest.json',
  'apple-touch-icon.png',
  './', // Alias for index.html
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches
        .open(CACHE)
        .then(cache => fetch(event.request)
          .then(response => cache.put(event.request, response.clone())
            .then(() => response))
          .catch(err => caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                } else {
                  throw err;
                }
              }
            )
          )
        )
    )
  }
});