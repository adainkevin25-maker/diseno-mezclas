// Service worker: deja la app disponible sin internet después de la primera visita.
const CACHE='sicmat-b-'+'202611051440';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './pyodide/pyodide.js','./pyodide/pyodide.asm.mjs','./pyodide/pyodide.asm.wasm','./pyodide/python_stdlib.zip','./pyodide/pyodide-lock.json'];  // motor de cálculo Python
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
// al activar, borra las copias viejas de esta misma app (cada app solo lee su propia copia)
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('sicmat-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// la página (index.html) se pide primero a internet para que las actualizaciones lleguen al instante;
// si no hay conexión se usa la copia guardada. El resto (Python, íconos) sale de la copia guardada.
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
  const pagina=q.mode==='navigate'||/\/(index\.html)?$/.test(new URL(q.url).pathname);
  if(pagina){e.respondWith(fetch(q).then(r=>{const c=r.clone();caches.open(CACHE).then(k=>k.put(q,c));return r;}).catch(()=>caches.open(CACHE).then(k=>k.match(q,{ignoreSearch:true}).then(r=>r||k.match('./index.html')))));return;}
  e.respondWith(caches.open(CACHE).then(k=>k.match(q,{ignoreSearch:true}).then(r=>r||fetch(q).then(res=>{if(res.ok)k.put(q,res.clone());return res;}))));});
