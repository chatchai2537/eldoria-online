// ตำนานเอลโดเรีย — ระบบบัญชีออนไลน์ (สมัคร / ล็อกอิน / ซิงค์เซฟ)
// เก็บเป็นไฟล์ต่อบัญชีใน DATA_DIR  หรือ (ถ้าตั้ง UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) เก็บใน Upstash Redis
// Render แพ็กเกจฟรีลบไฟล์เมื่อ deploy ใหม่ -> ถ้าอยากให้เซฟอยู่ถาวร ให้ใช้ Upstash (ฟรี) หรือเพิ่ม Disk
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UP_URL = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, ''), UP_TOK = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const MAX_SAVE = 1200 * 1024;
const GM_IDS = (process.env.GM_IDS || 'tiksi,wiwekwin2537').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
try { fs.mkdirSync(path.join(DATA_DIR, 'acct'), { recursive: true }); } catch (e) {}
const fkey = lid => crypto.createHash('sha256').update(lid).digest('hex').slice(0, 40);
const cache = new Map(), dirty = new Set(); const CACHE_MAX = 300;
async function dbGet(lid) {
  if (cache.has(lid)) return cache.get(lid);
  let rec = null;
  try {
    if (UP_URL) { const r = await fetch(UP_URL + '/get/eld:acct:' + fkey(lid), { headers: { authorization: 'Bearer ' + UP_TOK } }); const j = await r.json(); if (j && j.result) rec = JSON.parse(j.result); }
    else { const f = path.join(DATA_DIR, 'acct', fkey(lid) + '.json'); if (fs.existsSync(f)) rec = JSON.parse(fs.readFileSync(f, 'utf8')); }
  } catch (e) { console.log('dbGet', e.message); }
  if (rec) { cache.set(lid, rec); if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value); }
  return rec;
}
async function dbSet(lid, rec) {
  cache.set(lid, rec);
  try {
    const body = JSON.stringify(rec);
    if (UP_URL) await fetch(UP_URL + '/set/eld:acct:' + fkey(lid), { method: 'POST', headers: { authorization: 'Bearer ' + UP_TOK }, body });
    else { const f = path.join(DATA_DIR, 'acct', fkey(lid) + '.json'), t = f + '.tmp'; fs.writeFileSync(t, body); fs.renameSync(t, f); }
    return true;
  } catch (e) { console.log('dbSet', e.message); return false; }
}
const hashPw = (pw, salt) => new Promise((ok, no) => crypto.scrypt(String(pw), salt, 32, { N: 16384, r: 8, p: 1 }, (e, k) => e ? no(e) : ok(k.toString('hex'))));
const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
const clean = (s, n) => String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const ID_RE = /^[A-Za-z0-9_ก-๙]{3,16}$/;
const ipHits = new Map();
const ipOk = ip => { const now = Date.now(), a = (ipHits.get(ip) || []).filter(t => now - t < 60000); a.push(now); ipHits.set(ip, a); if (ipHits.size > 5000) ipHits.clear(); return a.length <= 40; };
async function authToken(rec, token) { if (!rec || !token) return false; const h = sha(token), now = Date.now(); return (rec.tokens || []).some(t => t.h === h && t.exp > now); }
function newToken(rec) { const t = crypto.randomBytes(24).toString('hex'); rec.tokens = (rec.tokens || []).filter(x => x.exp > Date.now()).slice(-7); rec.tokens.push({ h: sha(t), exp: Date.now() + 90 * 864e5 }); return t; }
const lockTbl = new Map();
async function handle(path_, d, ip) {
  if (path_ === '/api/ping') return { ok: true, t: Date.now(), store: UP_URL ? 'upstash' : 'file' };
  if (!ipOk(ip)) return { err: 'rate' };
  const id = clean(d.id, 16), lid = id.toLowerCase();
  if (!ID_RE.test(id)) return { err: 'badid' };
  if (path_ === '/api/register') {
    const pw = String(d.pw || ''); if (pw.length < 6 || pw.length > 64) return { err: 'badpw' };
    if (await dbGet(lid)) return { err: 'taken' };
    const salt = crypto.randomBytes(16).toString('hex');
    const rec = { id, name: clean(d.name, 14), salt, hash: await hashPw(pw, salt), created: Date.now(), rev: 0, lv: 0, upd: 0, save: '', bak: '', tokens: [], gm: GM_IDS.includes(lid) };
    const token = newToken(rec); if (!await dbSet(lid, rec)) return { err: 'store' };
    return { ok: true, token, rev: 0, name: rec.name };
  }
  const rec = await dbGet(lid);
  if (path_ === '/api/login') {
    if (!rec) return { err: 'nouser' };
    const lk = lockTbl.get(lid) || { n: 0, t: 0 }; if (lk.t > Date.now()) return { err: 'locked', wait: Math.ceil((lk.t - Date.now()) / 1000) };
    const h = await hashPw(d.pw || '', rec.salt);
    if (!crypto.timingSafeEqual(Buffer.from(h), Buffer.from(rec.hash))) { lk.n++; if (lk.n >= 8) { lk.t = Date.now() + Math.min(900, 20 * Math.pow(2, lk.n - 8)) * 1000; } lockTbl.set(lid, lk); return { err: 'badpw' }; }
    lockTbl.delete(lid); const token = newToken(rec); await dbSet(lid, rec);
    return { ok: true, token, name: rec.name, lv: rec.lv, rev: rec.rev, upd: rec.upd, save: rec.save || '', gm: !!rec.gm, id: rec.id };
  }
  if (!rec || !await authToken(rec, d.token)) return { err: 'auth' };
  if (path_ === '/api/save') {
    const save = String(d.save || ''); if (!save || save.length > MAX_SAVE) return { err: 'size' };
    if (!d.force && (d.base | 0) !== rec.rev) return { err: 'conflict', rev: rec.rev, lv: rec.lv, upd: rec.upd };
    if (rec.save && rec.save !== save) rec.bak = rec.save;
    rec.save = save; rec.rev++; rec.upd = Date.now(); rec.lv = Math.max(0, Math.min(999, d.lv | 0)); rec.cls = clean(d.cls, 10); rec.name = clean(d.name, 14) || rec.name;
    if (d.stat && typeof d.stat === 'object') rec.stat = { floor: d.stat.floor | 0, mine: d.stat.mine | 0, kills: d.stat.kills | 0 };
    if (!await dbSet(lid, rec)) return { err: 'store' };
    return { ok: true, rev: rec.rev, upd: rec.upd };
  }
  if (path_ === '/api/friends') {
    if (d.op === 'set') { const arr = Array.isArray(d.friends) ? d.friends : []; rec.friends = [...new Set(arr.map(x => clean(String(x), 14)).filter(Boolean))].slice(0, 200); if (!await dbSet(lid, rec)) return { err: 'store' }; }
    return { ok: true, friends: rec.friends || [] };
  }
  if (path_ === '/api/load') return { ok: true, name: rec.name, lv: rec.lv, rev: rec.rev, upd: rec.upd, save: rec.save || '' };
  if (path_ === '/api/pw') {
    const h = await hashPw(d.old || '', rec.salt); if (!crypto.timingSafeEqual(Buffer.from(h), Buffer.from(rec.hash))) return { err: 'badpw' };
    const np = String(d.pw || ''); if (np.length < 6 || np.length > 64) return { err: 'badpw' };
    rec.salt = crypto.randomBytes(16).toString('hex'); rec.hash = await hashPw(np, rec.salt); rec.tokens = []; const token = newToken(rec); await dbSet(lid, rec); return { ok: true, token };
  }
  return { err: 'unknown' };
}
// คืน true ถ้าจัดการคำขอแล้ว
function middleware(req, res, allowOrigin) {
  const u = (req.url || '').split('?')[0]; if (!u.startsWith('/api/')) return false;
  const origin = req.headers.origin || '', ok = allowOrigin(origin);
  const hd = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };
  if (ok && origin) { hd['access-control-allow-origin'] = origin; hd['vary'] = 'origin'; hd['access-control-allow-headers'] = 'content-type'; hd['access-control-allow-methods'] = 'POST,GET,OPTIONS'; }
  if (req.method === 'OPTIONS') { res.writeHead(ok ? 204 : 403, hd); res.end(); return true; }
  if (!ok) { res.writeHead(403, hd); res.end('{"err":"origin"}'); return true; }
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (req.method === 'GET') { handle(u, {}, ip).then(r => { res.writeHead(200, hd); res.end(JSON.stringify(r)); }); return true; }
  let body = '', big = false;
  req.on('data', c => { body += c; if (body.length > MAX_SAVE + 4096) { big = true; req.destroy(); } });
  req.on('end', async () => {
    if (big) return; let d = {}; try { d = JSON.parse(body || '{}'); } catch (e) { res.writeHead(400, hd); res.end('{"err":"json"}'); return; }
    let r; try { r = await handle(u, d && typeof d === 'object' ? d : {}, ip); } catch (e) { console.log('api', e.message); r = { err: 'server' }; }
    res.writeHead(200, hd); res.end(JSON.stringify(r));
  });
  return true;
}

// ---- ใช้กับเซิร์ฟเวอร์เกม: ยืนยันตัวตน + กล่องจดหมาย (ของจากประมูล/บอสโลก ส่งถึงแม้ออฟไลน์) ----
async function verify(id, token) { const lid = clean(id, 16).toLowerCase(); if (!ID_RE.test(lid)) return null; const rec = await dbGet(lid); if (!await authToken(rec, token)) return null; return { lid, name: rec.name || id, gm: !!rec.gm || GM_IDS.includes(lid) }; }
async function mailAdd(lid, item) { const rec = await dbGet(lid); if (!rec) return false; rec.mail = (rec.mail || []).slice(-60); rec.mail.push(Object.assign({ ts: Date.now() }, item)); return dbSet(lid, rec); }
async function mailTake(lid) { const rec = await dbGet(lid); if (!rec || !rec.mail || !rec.mail.length) return []; const m = rec.mail; rec.mail = []; await dbSet(lid, rec); return m; }
module.exports = { middleware, handle, GM_IDS, verify, mailAdd, mailTake };
