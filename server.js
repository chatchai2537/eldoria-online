// ตำนานเอลโดเรีย — เซิร์ฟเวอร์ออนไลน์ v2 (Node.js + ws)
// ตำแหน่งผู้เล่น · แชท (ทั่วไป/กิลด์/กระซิบ/ประวัติ/รายชื่อออนไลน์) · PvP (ตรวจฝั่งเซิร์ฟเวอร์) · กันสแปม/แฟลด
// รัน: npm install && npm start  (พอร์ต PORT หรือ 8787)
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 8787;
const MAX_PLAYERS = +process.env.MAX_PLAYERS || 200, MAX_PER_IP = +process.env.MAX_PER_IP || 4;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const MSG_PER_SEC = 90, TICK_MS = 100, HIST_MAX = 40;
const BAD = ['ควย','เหี้ย','สัส','เย็ด','fuck','shit','bitch','cunt','nigger'];
const ipCount = new Map(), banned = new Map(), players = new Map(), history = [];
let nextId = 1;
// ไฟล์เว็บ (ถ้ามี) — เสิร์ฟเกมจากเซิร์ฟเวอร์เดียวกันได้
const STATIC = { '/': ['index.html','text/html; charset=utf-8'], '/index.html': ['index.html','text/html; charset=utf-8'], '/manifest.webmanifest': ['manifest.webmanifest','application/manifest+json'],
  '/sw.js': ['sw.js','text/javascript; charset=utf-8'], '/icon-192.png': ['icon-192.png','image/png'], '/icon-512.png': ['icon-512.png','image/png'] };
const ACC = require('./accounts');
const WORLD = require('./world');
const PVP = require('./pvp');
const PARTY = require('./party');
const originOk = (o, host) => { if (!o || o === 'null' || o === 'file://') return true; if (!ALLOWED_ORIGINS.length || ALLOWED_ORIGINS.includes(o)) return true; try { return new URL(o).host === host; } catch (e) { return false; } };
const server = http.createServer((req, res) => {
  if ((req.url || '').split('?')[0] === '/api/pvptop') { res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }); res.end(JSON.stringify({ ok: true, list: PVP.top() })); return; }
  if (ACC.middleware(req, res, o => originOk(o, req.headers.host || ''))) return;
  const u = (req.url || '/').split('?')[0], f = STATIC[u];
  if ((u === '/' || u === '/index.html') && !process.env.SERVE_LOCAL) { res.writeHead(302, { location: GAME_URL, 'cache-control': 'no-store' }); res.end(); return; }
  if (u === '/sw.js' && !process.env.SERVE_LOCAL) { res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-cache' }); res.end("self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))).then(()=>self.registration.unregister()).then(()=>self.clients.matchAll()).then(cs=>cs.forEach(c=>{try{c.navigate(c.url)}catch(_){}}))));"); return; }
  if (f && fs.existsSync(path.join(__dirname, f[0]))) { res.writeHead(200, { 'content-type': f[1], 'x-content-type-options': 'nosniff', 'cache-control': u === '/sw.js' ? 'no-cache' : 'public, max-age=300' }); fs.createReadStream(path.join(__dirname, f[0])).pipe(res); return; }
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'access-control-allow-origin': '*' }); res.end('Eldoria online server OK — players: ' + players.size);
});
const clientIp = req => String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
const wss = new WebSocketServer({ server, maxPayload: 32768, perMessageDeflate: false,
  verifyClient: (info, cb) => { const ip = clientIp(info.req), origin = info.origin || '', host = info.req.headers.host || '';
    if ((banned.get(ip) || 0) > Date.now()) return cb(false, 403, 'banned');
    let sameHost = false; try { sameHost = !!origin && new URL(origin).host === host; } catch (e) {}
    if (ALLOWED_ORIGINS.length && !sameHost && !ALLOWED_ORIGINS.includes(origin) && origin !== 'null' && origin !== 'file://') return cb(false, 403, 'origin');
    if ((ipCount.get(ip) || 0) >= MAX_PER_IP) return cb(false, 429, 'too many connections');
    cb(true); } });
const filt = t => { let s = t; for (const w of BAD) s = s.split(w).join('*'.repeat(w.length)); return s; };
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const num = (v, a, b) => { v = +v; return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : a; };
const hex = v => /^#[0-9a-f]{6}$/i.test(String(v || '')) ? String(v) : null;
const DIRS = new Set(['u','d','l','r']), TOOLS = new Set(['sword','axe','pick','rod']);
const send = (p, o) => { if (p.ws.readyState === 1) p.ws.send(JSON.stringify(o)); };
const broadcast = (o, except) => { const s = JSON.stringify(o); for (const p of players.values()) if (p !== except && p.ws.readyState === 1 && p.joined) p.ws.send(s); };
const safeScene = sc => /^(town|shop|market|wboss)/.test(sc || '');
function sanitizeFx(f) { if (!f || typeof f !== 'object') return null; const e = {};
  if (f.e && typeof f.e === 'object') for (const k of ['sword','helm','chest','pants','arm','ring','neck']) if (f.e[k]) e[k] = num(f.e[k], 0, 30) | 0;
  const rn = f.rn && typeof f.rn === 'object' ? { el: clean(f.rn.el, 10), g: num(f.rn.g, 0, 9) | 0 } : null;
  return { e, rn, fw: clean(f.fw, 16), fb: clean(f.fb, 16), m: clean(f.m, 10), mo: !!f.mo }; }
function sanitizeState(d) {
  const armor = {}; if (d.armor && typeof d.armor === 'object') for (const k of ['sword','helm','chest','pants','arm','ring','neck']) if (d.armor[k]) armor[k] = clean(d.armor[k], 24);
  const tier = {}; if (d.tier && typeof d.tier === 'object') for (const k of ['sword','axe','pick']) tier[k] = num(d.tier[k], 0, 12) | 0;
  const lk = d.look && typeof d.look === 'object' ? { g: d.look.g === 'f' ? 'f' : 'm', top: hex(d.look.top), pants: hex(d.look.pants), hair: hex(d.look.hair) } : null;
  return { x: num(d.x, -1e4, 1e5), y: num(d.y, -1e4, 1e5), dir: DIRS.has(d.dir) ? d.dir : 'd', mv: !!d.mv, run: !!d.run, at: num(d.at, -1, 1), cmb: num(d.cmb, 0, 2) | 0,
    tool: TOOLS.has(d.tool) ? d.tool : 'sword', draw: !!d.draw, armor, tier, lv: num(d.lv, 1, 999) | 0, dead: !!d.dead, cls: clean(d.cls, 10), pvp: !!d.pvp, look: lk, mount: clean(d.mount, 10), fx: sanitizeFx(d.fx), stl: d.stl && d.stl.ti ? { ti: clean(d.stl.ti, 24), n: num(d.stl.n, 0, 12) | 0 } : null, ttl: clean(d.ttl, 16), hpP: num(d.hpP, 0, 100) | 0, pb: num(d.pb, 0, 3) | 0, q: num(d.q, 0, 1e13), cl: d.cl && typeof d.cl === 'object' ? { i: num(d.cl.i, 0, 9) | 0, n: clean(d.cl.n, 24), t: num(d.cl.t, 0, 1e13) } : null };
}
const findByName = n => { n = String(n || '').toLowerCase(); for (const p of players.values()) if (p.joined && p.name.toLowerCase() === n) return p; for (const p of players.values()) if (p.joined && p.name.toLowerCase().startsWith(n)) return p; return null; };
wss.on('connection', (ws, req) => {
  ws._socket && ws._socket.setNoDelay && ws._socket.setNoDelay(true);
  if (players.size >= MAX_PLAYERS) { ws.close(1013, 'server full'); return; }
  const ip = clientIp(req); ipCount.set(ip, (ipCount.get(ip) || 0) + 1);
  const id = nextId++;
  const p = { id, ws, ip, name: 'ผู้กล้า', sc: '', st: null, alive: true, chatT: 0, joined: false, rate: 0, rateT: Date.now(), strikes: 0, pvpT: [], hp: 0 };
  players.set(id, p); send(p, { t: 'welcome', id, n: players.size });
  ws.on('pong', () => { p.alive = true; });
  ws.on('message', raw => {
    const now = Date.now(); if (now - p.rateT > 1000) { p.rateT = now; p.rate = 0; }
    if (++p.rate > MSG_PER_SEC) { if (++p.strikes >= 3) { banned.set(ip, now + 10 * 60 * 1000); ws.close(1008, 'flood'); } else ws.close(1008, 'rate limit'); return; }
    let d; try { d = JSON.parse(raw); } catch (e) { return; } if (!d || typeof d !== 'object') return;
    if (d.t === 'hi') {
      const old = p.name; p.name = filt(clean(d.name, 14)) || 'ผู้กล้า';
      if (!p.joined) { p.joined = true; send(p, { t: 'hist', list: history }); broadcast({ t: 'sys', txt: p.name + ' เข้าสู่โลกแล้ว' }, p); }
      else if (old !== p.name) broadcast({ t: 'sys', txt: old + ' เปลี่ยนชื่อเป็น ' + p.name }, p);
    } else if (d.t === 'st') {
      const sc = clean(d.sc, 32);
      if (p.sc && sc !== p.sc) for (const o of players.values()) if (o !== p && o.sc === p.sc) send(o, { t: 'gone', id });
      const ns = sanitizeState(d);
      if (p.st && sc === p.sc && Math.hypot(ns.x - p.st.x, ns.y - p.st.y) > 900 && !ns.dead) { if (++p.strikes > 20) { ws.close(1008, 'speed'); return; } }
      if (sc !== p.sc) p.scT = now; p.sc = sc; p.st = ns;
    } else if (d.t === 'chat') {
      if (now - p.chatT < 700) return; p.chatT = now;
      const txt = filt(clean(d.txt, 140)); if (!txt) return;
      const ch = d.ch === 'guild' ? 'guild' : 'gen', msg = { t: 'chat', id, name: p.name, ch, txt, ts: now };
      if (ch === 'guild') { if (!p.gid) { send(p, { t: 'sys', txt: 'คุณยังไม่มีกิลด์ — สร้างหรือเข้าร่วมได้ที่กิลด์นักผจญภัยในเมือง' }); return; } msg.gtag = p.gtag; for (const o of players.values()) if (o !== p && o.gid === p.gid) send(o, msg); return; }
      history.push(msg); if (history.length > HIST_MAX) history.shift(); broadcast(msg, p);
    } else if (d.t === 'whisper') {
      if (now - p.chatT < 500) return; p.chatT = now;
      const txt = filt(clean(d.txt, 140)), to = findByName(clean(d.to, 14)); if (!txt) return;
      if (!to || to === p) { send(p, { t: 'sys', txt: 'ไม่พบผู้เล่นชื่อ "' + clean(d.to, 14) + '" ที่ออนไลน์อยู่' }); return; }
      send(to, { t: 'whisper', from: p.name, txt }); send(p, { t: 'whisper_ok', to: to.name, txt });
    } else if (d.t === 'who') {
      const list = [...players.values()].filter(o => o.joined).map(o => ({ name: o.name, lv: o.st ? o.st.lv : 1, sc: o.sc || '', cls: o.st ? o.st.cls : '', pvp: !!(o.st && o.st.pvp), ttl: o.st ? o.st.ttl : '' }));
      send(p, { t: 'who', list });
    } else if (d.t === 'pvp') {
      // ตรวจ PvP ฝั่งเซิร์ฟเวอร์: ฉากเดียวกัน · ไม่ใช่ในเมือง · (สนามประลอง หรือ เปิด PvP ทั้งคู่) · ระยะ · เพดานดาเมจ · ความถี่
      const to = players.get(+d.to); if (!to || to === p || !p.st || !to.st || p.st.dead || to.st.dead) return;
      if (p.sc !== to.sc || safeScene(p.sc)) return;
      const duel = PVP.duelOk(p, to); if (p.duel && !duel) return; if (!(duel || p.sc === 'arena' || (p.st.pvp && to.st.pvp))) return;
      if (Math.hypot(p.st.x - to.st.x, p.st.y - to.st.y) > 450) return;
      p.pvpT = p.pvpT.filter(t => now - t < 1000); if (p.pvpT.length >= 10) return; p.pvpT.push(now);
      const dmg = Math.round(num(d.dmg, 1, 150 + p.st.lv * 45));
      send(to, { t: 'pvphit', from: id, name: p.name, dmg, crit: !!d.crit });
    } else if (d.t === 'pvpko') {
      if (PVP.ko(p, d.by)) return; const by = players.get(+d.by); if (by && by.sc === p.sc) broadcast({ t: 'sys', txt: '⚔️ ' + by.name + ' ล้ม ' + p.name + (p.sc === 'arena' ? ' ในสนามประลอง!' : ' ในการดวล PvP!') });
    } else if (PARTY.onMsg(p, d, now)) {
    } else if (!PVP.onMsg(p, d, now)) WORLD.onMsg(p, d, now);
  });
  ws.on('close', () => { PARTY.onClose(p); PVP.onClose(p); WORLD.onClose(p); ipCount.set(ip, Math.max(0, (ipCount.get(ip) || 1) - 1)); players.delete(id); broadcast({ t: 'gone', id }); if (p.joined) broadcast({ t: 'sys', txt: p.name + ' ออกจากเกม' }); });
  ws.on('error', () => {});
});
setInterval(() => { const byScene = new Map(); for (const p of players.values()) if (p.st) { if (!byScene.has(p.sc)) byScene.set(p.sc, []); byScene.get(p.sc).push(p); }
  const n = [...players.values()].filter(p => p.joined).length;
  for (const p of players.values()) { const list = (byScene.get(p.sc) || []).filter(o => o !== p).map(o => Object.assign({ id: o.id, name: o.name, gtag: o.gtag || '' }, o.st)); send(p, { t: 'snap', on: n, ps: list, h: PARTY.hostFor(p.sc, byScene.get(p.sc) || []) }); }
  PARTY.cleanHosts(byScene); }, TICK_MS);
setInterval(() => { for (const p of players.values()) { if (!p.alive) { p.ws.terminate(); continue; } p.alive = false; try { p.ws.ping(); } catch (e) {} } }, 15000);
WORLD.init({ players, send, broadcast, ACC, clean, num });
PVP.init({ players, send, broadcast, clean, num });
PARTY.init({ players, send, clean, num, filt, findByName });
ACC.setGuildHook((lid, g) => { for (const p of players.values()) if (p.acct === lid) { p.gid = g ? g.id : ''; p.gtag = g ? g.tag : ''; p.gname = g ? g.name : ''; send(p, { t: 'gupd', g }); } });
// เปิดหน้าเกมที่ Render → ส่งไปเวอร์ชันล่าสุดบน GitHub Pages (ไม่ต้อง Deploy Render ทุกครั้งที่อัปเดตเกม)
const GAME_URL = process.env.GAME_URL || 'https://chatchai2537.github.io/eldoria-online/';
server.listen(PORT, () => console.log('Eldoria server v2 on :' + PORT));
