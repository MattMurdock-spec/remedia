/* Remedia service worker: offline-first. Bump V when you publish a new version. */
const V='remedia-v2';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png','stock.png','ledger.png','stock.html','invoice.html','ledger.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin===location.origin){
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>{
      const n=fetch(r).then(res=>{if(res.ok){const cl=res.clone();caches.open(V).then(x=>x.put(r,cl))}return res}).catch(()=>c);
      return c||n}).then(res=>res||caches.match('index.html')));
  }else{ /* fonts etc.: network first, cached fallback */
    e.respondWith(fetch(r).then(res=>{const cl=res.clone();caches.open(V).then(x=>x.put(r,cl));return res}).catch(()=>caches.match(r)));
  }});
