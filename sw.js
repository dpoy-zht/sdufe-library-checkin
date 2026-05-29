const CACHE_NAME = 'nailong-v2.5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './background.png',
  './nailong-icon.png',
  './nailong1.png',
  './nailong2.png',
  './nailong3.png',
  './nailong4.png',
  './nailong5.png',
  './nailong6.png',
  './nailong-happy.png',
  './nailong-urge.png',
  './nailong-sleep.png',
  './nailong-surprise.png',
  './nailong-eat.png',
  './nailong-longleg.jpg'
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
    fetch(e.request).then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
