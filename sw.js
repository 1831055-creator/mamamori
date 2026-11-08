const CACHE = 'mamamori-static-v2';
const STATIC_FILES = ['./icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon.png', './manifest.webmanifest', './mamamori-cats.webp', './mamamori-logo-a.webp', './mamamori-logo-e.webp'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => new Response(
      '<!doctype html><meta charset="utf-8"><title>ママモリ</title><p>ネットワークに接続できません。接続を確認してから開き直してください。</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
    return;
  }
  const path = new URL(e.request.url).pathname;
  if (STATIC_FILES.some((p) => path.endsWith(p.replace('./', '/')))) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
  }
});
