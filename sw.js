const CACHE_NAME = 'nailong-v2.3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './nailong-icon.png',
  './nailong1.png',
  './nailong2.png',
  './nailong3.png',
  './nailong4.png',
  './nailong5.png',
  './nailong6.png',
  './nailong-happy.png',
  './nailong-urge.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
