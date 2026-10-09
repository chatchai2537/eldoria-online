// Service worker — เปิดเร็ว/เล่นออฟไลน์ได้ · อัปเดตเกมอัตโนมัติ (เช็กเวอร์ชันใหม่จากเว็บก่อนเสมอ)
// ทุกครั้งที่อัปเดตเกมแล้วอยากให้ SW ตัวใหม่เข้ามาแทนที่ทันที ให้เปลี่ยนเลขเวอร์ชันบรรทัดล่างนี้ (v51 → v52 ...)
const C='eldoria-v52';const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
