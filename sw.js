const CACHE_NAME = 'nailong-v3.0';
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
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => !k.startsWith('nailong-v3')).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  // HTML 文件：始终从网络获取最新版本
  if (request.destination === 'document' || request.url.endsWith('.html')) {
    e.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  // 其他资源：网络优先，失败回退缓存
  e.respondWith(
    fetch(request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
