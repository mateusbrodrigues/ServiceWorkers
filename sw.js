self.addEventListener('install', (event) => {
  console.log(`[Service Worker] install event lifecycle!!`);
  self.skipWaiting(); // don't wait for installation just activate it
  event.waitUntil(
    caches
      .open('sw-cache-v1')
      .then(async (cache) =>
        cache.addAll([
          '/',
          '/index.html',
          'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.fluid.classless.min.css',
          './app.js',
          '/images/cat.svg',
          '/images/dog.svg',
        ])
      )
  );
});

self.addEventListener('activate', () => {
  console.log(`[Service Worker] activate event lifecycle!`);
  return self.clients.claim(); // claim all tabs
});

self.addEventListener('fetch', async (event) => {
  console.log(`[Service Worker] fetch event lifecycle!`);
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cache = await caches.open('sw-cache-v1');
  const response = await cache.match(request);
  if (response) {
    return response;
  }
  console.log('URL not in the cache: ', request.url);
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    return new Response(`Network error happened: ${error}`, {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
