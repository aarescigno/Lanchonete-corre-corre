/* Service worker do Lanchonete Corre-Corre (gerado por app/build.py). */
const CACHE = 'lcc-__VERSAO__';
const PRECACHE = __PRECACHE__;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('lcc-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const fonte = url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !fonte) return;
  // página: rede primeiro (pega a versão nova), cache se estiver sem internet
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); return r;
    }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // demais arquivos e fontes: cache primeiro, guardando o que vier da rede
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === 'opaque') { const copia = r.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
    return r;
  })));
});
