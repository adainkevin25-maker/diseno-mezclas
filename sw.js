// Service worker: deja la app disponible sin internet después de la primera visita.
const CACHE='sicmat-b-'+'202611040309';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './pyodide/pyodide.js','./pyodide/pyodide.asm.mjs','./pyodide/pyodide.asm.wasm','./pyodide/python_stdlib.zip','./pyodide/pyodide-lock.json'];  // motor de cálculo Python
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('sicmat-b-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;}).catch(()=>caches.match('./index.html'))));});
