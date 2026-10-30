const CACHE = 'sustenance-shell-v3-3';
const SHELL = ['./','./index.html','./style.css','./app.js','./cloud.js','./firebase-config.js','./readings.json','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch', e => {
 const r=e.request;const url=new URL(r.url); if(r.method!=='GET' || url.origin!==self.location.origin) return;
 e.respondWith(fetch(r).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return response;}).catch(()=>caches.match(r).then(hit=>hit||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});
