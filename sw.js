/* Păstrează pagina pe telefon, ca să se deschidă imediat și fără semnal.
   Afișează copia salvată și o actualizează în fundal. */
const CACHE = 'portofoliu-case-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const salvat = await cache.match(req, { ignoreSearch: true });
      const retea = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      });
      if (salvat) { e.waitUntil(retea.catch(() => {})); return salvat; }
      return retea;
    })
  );
});
