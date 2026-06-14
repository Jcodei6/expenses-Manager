const CACHE_NAME = 'manager-cache-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Forces the newest version to take over immediately
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Network-first strategy: Always try to get the most updated files from the internet first
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        // If offline, fallback to the cache
        return caches.match(e.request);
      })
  );
});
