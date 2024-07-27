self.addEventListener('install', () => {
  console.log(`[Service Worker] install event lifecycle!`);
  self.skipWaiting(); // don't wait for installation just activate it
});

self.addEventListener('activate', () => {
  console.log(`[Service Worker] activate event lifecycle!`);
  return self.clients.claim(); // claim all tabs
});

self.addEventListener('fetch', (event) => {
  console.log(`[Service Worker] fetch event lifecycle!`);
  const url = new URL(event.request.url);
  if (url.pathname === '/images/dog.svg') {
    event.respondWith(fetch('/images/cat.svg'));
  }
  event.respondWith(fetch(event.request));
});
