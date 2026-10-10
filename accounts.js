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
// ---------- ตารางอันดับ (เก็บรวมเป็นเอกสารเดียว: Upstash key eld:lb หรือไฟล์ data/lb.json) ----------
const LB = { map: {}, dirty: false, loaded: null };
function lbLoad() { if (LB.loaded) return LB.loaded; LB.loaded = (async () => { try {
  if (UP_URL) { const r = await fetch(UP_URL + '/get/eld:lb', { headers: { authorization: 'Bearer ' + UP_TOK } }); const j = await r.json(); if (j && j.result) LB.map = JSON.parse(j.result) || {}; }
  else { const f = path.join(DATA_DIR, 'lb.json'); if (fs.existsSync(f)) LB.map = JSON.parse(fs.readFileSync(f, 'utf8')) || {}; }
} catch (e) { console.log('lbLoad', e.message); } })(); return LB.loaded; }
async function lbFlush() { if (!LB.dirty) return; LB.dirty = false; const body = JSON.stringify(LB.map); try {
  if (UP_URL) await fetch(UP_URL + '/set/eld:lb', { method: 'POST', headers: { authorization: 'Bearer ' + UP_TOK }, body });
  else { const f = path.join(DATA_DIR, 'lb.json'), t = f + '.tmp'; fs.writeFileSync(t, body); fs.renameSync(t, f); }
} catch (e) { console.log('lbFlush', e.message); LB.dirty = true; } }
{ const iv = setInterval(lbFlush, 30000); if (iv.unref) iv.unref(); }
const lbN = (v, mx) => Math.max(0, Math.min(mx, Math.floor(+v || 0)));
// v4.60: รูปตัวละครในตารางอันดับ (av) + กันโกง: บัญชีที่เลเวลกระโดดผิดปกติ (flag) ไม่ขึ้นอันดับ
const AVID = /^[a-z0-9_]{1,24}$/;
function lbAv(a) { try { if (!a || typeof a !== 'object') return null; const o = { c: clean(a.c, 10), ts: Math.max(0, Math.min(30, a.ts | 0)), a: {} };
  for (const k of ['helm', 'chest', 'pants', 'arm', 'sword']) if (a.a && AVID.test(String(a.a[k] || ''))) o.a[k] = String(a.a[k]);
  if (AVID.test(String(a.fb || ''))) o.fb = String(a.fb); if (AVID.test(String(a.fw || ''))) o.fw = String(a.fw);
  if (a.lk && typeof a.lk === 'object') { o.lk = {}; let n = 0; for (const k in a.lk) { if (n++ > 12) break; const v = a.lk[k]; if (/^[a-z0-9]{1,8}$/i.test(k) && (typeof v === 'number' || (typeof v === 'string' && v.length <= 12))) o.lk[k] = v; } }
  return JSON.stringify(o).length <= 600 ? o : null; } catch (e) { return null; } }
function lbTop() { const arr = Object.values(LB.map).filter(x => !x.flag); const top = k => arr.filter(x => x[k] > 0).sort((a, b) => b[k] - a[k] || b.lv - a.lv).slice(0, 20).map(x => ({ n: x.n, v: x[k], lv: x.lv, cls: x.cls, t: x.t, av: x.av || null }));
  return { ok: true, lv: top('lv'), k: top('k'), b: top('b'), w: top('w'), fl: top('fl'), n: arr.length }; }

// ---------- กิลด์ผู้เล่น (เอกสารเดียว: Upstash key eld:guilds หรือไฟล์ data/guilds.json) ----------
const GD = { map: {}, idx: {}, dirty: false, loaded: null, hook: null };
const GMAX = 30, GROLE = { leader: 3, officer: 2, member: 1 };
function gIndex() { GD.idx = {}; for (const g of Object.values(GD.map)) for (const l in g.members) GD.idx[l] = g.id; }
function gLoad() { if (GD.loaded) return GD.loaded; GD.loaded = (async () => { try {
  if (UP_URL) { const r = await fetch(UP_URL + '/get/eld:guilds', { headers: { authorization: 'Bearer ' + UP_TOK } }); const j = await r.json(); if (j && j.result) GD.map = JSON.parse(j.result) || {}; }
  else { const f = path.join(DATA_DIR, 'guilds.json'); if (fs.existsSync(f)) GD.map = JSON.parse(fs.readFileSync(f, 'utf8')) || {}; }
} catch (e) { console.log('gLoad', e.message); } gIndex(); })(); return GD.loaded; }
async function gFlush() { if (!GD.dirty) return; GD.dirty = false; const body = JSON.stringify(GD.map); try {
  if (UP_URL) await fetch(UP_URL + '/set/eld:guilds', { method: 'POST', headers: { authorization: 'Bearer ' + UP_TOK }, body });
  else { const f = path.join(DATA_DIR, 'guilds.json'), t = f + '.tmp'; fs.writeFileSync(t, body); fs.renameSync(t, f); }
} catch (e) { console.log('gFlush', e.message); GD.dirty = true; } }
{ const iv = setInterval(gFlush, 15000); if (iv.unref) iv.unref(); }
const gTouch = () => { GD.dirty = true; gIndex(); setTimeout(gFlush, 1500); };
const mid = lid => fkey('m:' + lid).slice(0, 12);
const gNotify = (lid, g) => { try { if (GD.hook) GD.hook(lid, g ? { id: g.id, tag: g.tag, name: g.name } : null); } catch (e) {} };
function gPub(g, me) { const r = GROLE[(g.members[me] || {}).role] || 0;
  const members = Object.entries(g.members).map(([l, m]) => ({ id: mid(l), n: m.n, lv: m.lv, role: m.role, j: m.j, s: m.s, me: l === me })).sort((x, y) => (GROLE[y.role] - GROLE[x.role]) || (y.lv - x.lv));
  const apps = r >= 2 ? Object.entries(g.apps || {}).map(([l, a]) => ({ id: mid(l), n: a.n, lv: a.lv, t: a.t })) : [];
  return { id: g.id, name: g.name, tag: g.tag, notice: g.notice || '', open: !!g.open, created: g.created, members, apps, max: GMAX, role: (g.members[me] || {}).role || '' }; }
const byMid = (obj, id) => Object.keys(obj || {}).find(l => mid(l) === id);
function guildOfSync(lid) { const g = GD.map[GD.idx[lid]]; return g ? { id: g.id, tag: g.tag, name: g.name } : null; }
async function guildOf(lid) { await gLoad(); return guildOfSync(lid); }
function gTouchMember(lid, name, lv) { const g = GD.map[GD.idx[lid]]; if (!g) return; const m = g.members[lid]; if (!m) return; m.n = name || m.n; m.lv = lv | 0; m.s = Date.now(); GD.dirty = true; }
async function guildOp(lid, rec, d) {
  await gLoad(); const op = String(d.op || ''), myG = GD.map[GD.idx[lid]], me = myG ? myG.members[lid] : null, myR = me ? GROLE[me.role] : 0;
  if (op === 'my') { if (myG && me) { me.s = Date.now(); me.n = rec.name || me.n; me.lv = rec.lv | 0; } return { ok: true, g: myG ? gPub(myG, lid) : null, pend: Object.values(GD.map).filter(g => g.apps && g.apps[lid]).map(g => g.id) }; }
  if (op === 'list') { const q = clean(d.q, 16).toLowerCase(); const L = Object.values(GD.map).filter(g => !q || g.name.toLowerCase().includes(q) || g.tag.toLowerCase().includes(q))
      .map(g => ({ id: g.id, name: g.name, tag: g.tag, n: Object.keys(g.members).length, lv: Math.round(Object.values(g.members).reduce((s, m) => s + (m.lv | 0), 0) / Math.max(1, Object.keys(g.members).length)), open: !!g.open, notice: (g.notice || '').slice(0, 60), lead: (g.members[g.leader] || {}).n || '', app: !!(g.apps && g.apps[lid]) }))
      .sort((x, y) => y.n - x.n || y.lv - x.lv).slice(0, 40); return { ok: true, list: L }; }
  if (op === 'create') { if (myG) return { err: 'inguild' }; const name = clean(d.name, 16), tag = clean(d.tag, 4).toUpperCase();
    if (!/^[A-Za-z0-9ก-๙ _]{3,16}$/.test(name) || !/^[A-Z0-9ก-๙]{2,4}$/.test(tag)) return { err: 'badname' };
    if (Object.values(GD.map).some(g => g.name.toLowerCase() === name.toLowerCase() || g.tag === tag)) return { err: 'taken' };
    const id = crypto.randomBytes(5).toString('hex'); const g = { id, name, tag, leader: lid, members: { [lid]: { n: rec.name || rec.id, lv: rec.lv | 0, role: 'leader', j: Date.now(), s: Date.now() } }, apps: {}, notice: 'ยินดีต้อนรับสู่กิลด์ ' + name + '!', open: true, created: Date.now() };
    for (const o of Object.values(GD.map)) if (o.apps) delete o.apps[lid];
    GD.map[id] = g; gTouch(); gNotify(lid, g); return { ok: true, g: gPub(g, lid) }; }
  if (op === 'join') { if (myG) return { err: 'inguild' }; const g = GD.map[clean(d.gid, 12)]; if (!g) return { err: 'nog' };
    if (Object.keys(g.members).length >= GMAX) return { err: 'full' };
    if (g.open) { for (const o of Object.values(GD.map)) if (o.apps) delete o.apps[lid]; g.members[lid] = { n: rec.name || rec.id, lv: rec.lv | 0, role: 'member', j: Date.now(), s: Date.now() }; gTouch(); gNotify(lid, g); return { ok: true, joined: true, g: gPub(g, lid) }; }
    g.apps = g.apps || {}; if (Object.keys(g.apps).length >= 50) return { err: 'full' }; g.apps[lid] = { n: rec.name || rec.id, lv: rec.lv | 0, t: Date.now() }; gTouch(); return { ok: true, applied: true }; }
  if (op === 'cancel') { const g = GD.map[clean(d.gid, 12)]; if (g && g.apps) delete g.apps[lid]; gTouch(); return { ok: true }; }
  if (!myG) return { err: 'noguild' };
  if (op === 'accept' || op === 'reject') { if (myR < 2) return { err: 'perm' }; const l = byMid(myG.apps, d.mid); if (!l) return { err: 'nouser' };
    if (op === 'accept') { if (GD.idx[l]) { delete myG.apps[l]; gTouch(); return { err: 'inguild' }; } if (Object.keys(myG.members).length >= GMAX) return { err: 'full' };
      const a = myG.apps[l]; myG.members[l] = { n: a.n, lv: a.lv, role: 'member', j: Date.now(), s: 0 }; for (const o of Object.values(GD.map)) if (o.apps) delete o.apps[l]; gTouch(); gNotify(l, myG); }
    else { delete myG.apps[l]; gTouch(); } return { ok: true, g: gPub(myG, lid) }; }
  if (op === 'kick') { const l = byMid(myG.members, d.mid); if (!l || l === lid) return { err: 'nouser' }; const tr = GROLE[myG.members[l].role]; if (myR < 2 || tr >= myR) return { err: 'perm' };
    delete myG.members[l]; gTouch(); gNotify(l, null); return { ok: true, g: gPub(myG, lid) }; }
  if (op === 'role') { if (myR < 3) return { err: 'perm' }; const l = byMid(myG.members, d.mid); if (!l || l === lid) return { err: 'nouser' };
    if (d.role === 'leader') { myG.members[l].role = 'leader'; myG.members[lid].role = 'officer'; myG.leader = l; } else myG.members[l].role = d.role === 'officer' ? 'officer' : 'member';
    gTouch(); return { ok: true, g: gPub(myG, lid) }; }
  if (op === 'set') { if (myR < 2) return { err: 'perm' }; if (d.notice != null) myG.notice = clean(d.notice, 200); if (d.open != null) myG.open = !!d.open; gTouch(); return { ok: true, g: gPub(myG, lid) }; }
  if (op === 'leave' || op === 'disband') {
    if (op === 'disband') { if (myR < 3) return { err: 'perm' }; for (const l in myG.members) gNotify(l, null); delete GD.map[myG.id]; gTouch(); return { ok: true, g: null }; }
    delete myG.members[lid]; const rest = Object.keys(myG.members);
    if (!rest.length) delete GD.map[myG.id];
    else if (myG.leader === lid) { const nx = rest.sort((p, q) => (GROLE[myG.members[q].role] - GROLE[myG.members[p].role]) || (myG.members[p].j - myG.members[q].j))[0]; myG.members[nx].role = 'leader'; myG.leader = nx; }
    gTouch(); gNotify(lid, null); return { ok: true, g: null }; }
  return { err: 'unknown' }; }

// ---------- v4.61 💠 เหรียญแฟชั่น: ยอดเก็บที่เซิร์ฟเวอร์เท่านั้น (แก้ในเครื่องไม่ได้) · ได้จากเล่นเกม (จำกัด/วัน) หรือเติมเงินพร้อมเพย์ (GM อนุมัติ) ----------
const GEMP = {"b:night":45,"b:sakura":60,"b:star":80,"b:pirate":70,"b:flame":180,"b:frost":180,"b:th_chakkri":120,"b:th_boromphiman":100,"b:th_chitlada":60,"b:th_nangram":160,"b:th_khon":220,"b:th_nakrop":90,"b:th_khunnang":120,"b:th_chaona":35,"b:th_thep":300,"b:c_sword":140,"b:c_mage":160,"b:c_archer":140,"b:c_ninja":150,"b:c_sniper":140,"b:c_paladin":180,"b:c_cleric":160,"b:c_necro":160,"b:c_monk":140,"b:c_dragoon":180,"b:c_summoner":150,"w:dragon":90,"w:sakura":65,"w:crystal":90,"w:moon":120,"w:holy":200,"w:thunder":150,"w:w_sword":160,"w:w_mage":160,"w:w_archer":160,"w:w_ninja":160,"w:w_sniper":160,"w:w_paladin":180,"w:w_cleric":160,"w:w_necro":180,"w:w_monk":150,"w:w_dragoon":180,"w:w_summoner":160};
const GEM_CAP = 10; // ได้ฟรีจากการเล่นสูงสุดต่อวัน
const GEM_EARN = { login: { n: 2, cd: 0 }, lboss: { n: 2, cd: 25 * 60e3 }, wboss: { n: 3, cd: 3 * 3600e3 }, xchg: { n: 1, cd: 0, max: 5 } };
const GEM_PKG = [{ id: 'p1', baht: 35, gem: 30 }, { id: 'p2', baht: 99, gem: 100 }, { id: 'p3', baht: 299, gem: 330 }, { id: 'p4', baht: 599, gem: 700 }];
// ข้อมูลรับเงิน: ตั้งใน Render → Environment (ไม่เก็บในโค้ด) TOPUP_PROMPTPAY = เบอร์/เลขบัตรพร้อมเพย์ · TOPUP_NAME = ชื่อบัญชี · TOPUP_CONTACT = ช่องทางส่งสลิป (เช่น LINE: @xxxx)
const topupInfo = () => ({ pp: String(process.env.TOPUP_PROMPTPAY || '').replace(/[^0-9]/g, '').slice(0, 15), nm: clean(process.env.TOPUP_NAME, 40), ct: clean(process.env.TOPUP_CONTACT, 80) });
const bkkDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const TQ = { map: {}, dirty: false, loaded: null };
function tqLoad() { if (TQ.loaded) return TQ.loaded; TQ.loaded = (async () => { try {
  if (UP_URL) { const r = await fetch(UP_URL + '/get/eld:topq', { headers: { authorization: 'Bearer ' + UP_TOK } }); const j = await r.json(); if (j && j.result) TQ.map = JSON.parse(j.result) || {}; }
  else { const f = path.join(DATA_DIR, 'topq.json'); if (fs.existsSync(f)) TQ.map = JSON.parse(fs.readFileSync(f, 'utf8')) || {}; }
} catch (e) { console.log('tqLoad', e.message); } })(); return TQ.loaded; }
async function tqFlush() { const body = JSON.stringify(TQ.map); try {
  if (UP_URL) await fetch(UP_URL + '/set/eld:topq', { method: 'POST', headers: { authorization: 'Bearer ' + UP_TOK }, body });
  else { const f = path.join(DATA_DIR, 'topq.json'), t = f + '.tmp'; fs.writeFileSync(t, body); fs.renameSync(t, f); }
} catch (e) { console.log('tqFlush', e.message); } }
function gemLog(rec, n, why) { rec.glog = (rec.glog || []).slice(-49); rec.glog.push({ t: Date.now(), n, w: String(why).slice(0, 40), b: rec.gem | 0 }); }
function gemDay(rec) { const d = bkkDay(); if (rec.gday !== d) { rec.gday = d; rec.gearn = 0; rec.gx = 0; const a = Math.min(GEM_EARN.login.n, GEM_CAP); rec.gem = (rec.gem | 0) + a; rec.gearn = a; gemLog(rec, a, 'login'); return true; } return false; }
const gemPub = rec => ({ ok: true, gem: rec.gem | 0, fown: rec.fown || [], earn: rec.gearn | 0, cap: GEM_CAP, xchg: rec.gx | 0, xmax: GEM_EARN.xchg.max, pkg: GEM_PKG, top: topupInfo(), gm: !!rec.gm || GM_IDS.includes(String(rec.id || '').toLowerCase()) });
async function gemOp(lid, rec, d) {
  const op = String(d.op || ''); const isGM = !!rec.gm || GM_IDS.includes(lid);
  if (gemDay(rec)) await dbSet(lid, rec);
  if (op === 'bal') { await tqLoad(); const r = gemPub(rec); r.pend = Object.entries(TQ.map).filter(([, q]) => q.lid === lid && q.st === 'p').map(([ref, q]) => ({ ref, baht: q.baht, gem: q.gem, t: q.t })); return r; }
  if (op === 'earn') { const src = String(d.src || ''), E = GEM_EARN[src]; if (!E || src === 'login' || src === 'wboss') return { err: 'src' }; // v4.64: บอสโลกแจกจากเซิร์ฟเวอร์ (world.js) แทน
    rec.gt = rec.gt || {}; const now = Date.now(); if (E.cd && now - (rec.gt[src] || 0) < E.cd) return { err: 'cd' };
    if ((rec.gearn | 0) >= GEM_CAP) return { err: 'cap' };
    if (src === 'xchg') { if ((rec.gx | 0) >= E.max) return { err: 'xmax' }; rec.gx = (rec.gx | 0) + 1; }
    const n = Math.min(E.n, GEM_CAP - (rec.gearn | 0)); rec.gem = (rec.gem | 0) + n; rec.gearn = (rec.gearn | 0) + n; rec.gt[src] = now; gemLog(rec, n, src);
    if (!await dbSet(lid, rec)) return { err: 'store' }; const r = gemPub(rec); r.got = n; return r; }
  if (op === 'buy') { const key = String(d.key || ''), pr = GEMP[key]; if (!pr) return { err: 'item' };
    rec.fown = rec.fown || []; if (rec.fown.includes(key)) return gemPub(rec);
    if ((rec.gem | 0) < pr) return { err: 'gem', need: pr, gem: rec.gem | 0 };
    rec.gem = (rec.gem | 0) - pr; rec.fown.push(key); gemLog(rec, -pr, 'buy ' + key); if (!await dbSet(lid, rec)) return { err: 'store' }; return gemPub(rec); }
  if (op === 'req') { const P = GEM_PKG.find(p => p.id === d.pkg); if (!P) return { err: 'pkg' }; if (!topupInfo().pp) return { err: 'closed' };
    await tqLoad(); if (Object.values(TQ.map).filter(q => q.lid === lid && q.st === 'p').length >= 3) return { err: 'many' };
    let ref; do { ref = crypto.randomBytes(3).toString('hex').toUpperCase(); } while (TQ.map[ref]);
    TQ.map[ref] = { lid, id: rec.id, n: rec.name || rec.id, baht: P.baht, gem: P.gem, t: Date.now(), st: 'p' };
    const ks = Object.keys(TQ.map); if (ks.length > 2000) for (const k of ks.filter(k => TQ.map[k].st !== 'p').slice(0, ks.length - 2000)) delete TQ.map[k];
    await tqFlush(); return { ok: true, ref, baht: P.baht, gem: P.gem, top: topupInfo() }; }
  if (op === 'cancel') { await tqLoad(); const q = TQ.map[clean(d.ref, 8).toUpperCase()]; if (q && q.lid === lid && q.st === 'p') { q.st = 'c'; await tqFlush(); } return { ok: true }; }
  // ----- GM เท่านั้น -----
  if (!isGM) return { err: 'perm' };
  if (op === 'list') { await tqLoad(); return { ok: true, list: Object.entries(TQ.map).filter(([, q]) => d.all ? true : q.st === 'p').sort((a, b) => b[1].t - a[1].t).slice(0, 100).map(([ref, q]) => Object.assign({ ref }, q, { lid: undefined })) }; }
  if (op === 'ok' || op === 'no') { await tqLoad(); const ref = clean(d.ref, 8).toUpperCase(), q = TQ.map[ref]; if (!q || q.st !== 'p') return { err: 'noreq' };
    if (op === 'ok') { const tr = await dbGet(q.lid); if (!tr) return { err: 'nouser' }; tr.gem = (tr.gem | 0) + q.gem; gemLog(tr, q.gem, 'topup ' + ref + ' ' + q.baht + 'THB by ' + lid); if (!await dbSet(q.lid, tr)) return { err: 'store' }; }
    q.st = op === 'ok' ? 'y' : 'n'; q.by = lid; q.at = Date.now(); await tqFlush(); return { ok: true }; }
  if (op === 'credit') { const tl = clean(d.to, 16).toLowerCase(); if (!ID_RE.test(tl)) return { err: 'badid' }; const n = Math.max(-100000, Math.min(100000, d.n | 0)); if (!n) return { err: 'n' };
    const tr = await dbGet(tl); if (!tr) return { err: 'nouser' }; tr.gem = Math.max(0, (tr.gem | 0) + n); gemLog(tr, n, 'gm ' + lid + ' ' + clean(d.note, 20)); if (!await dbSet(tl, tr)) return { err: 'store' }; return { ok: true, to: tr.id, gem: tr.gem }; }
  if (op === 'look') { const tl = clean(d.to, 16).toLowerCase(); const tr = ID_RE.test(tl) && await dbGet(tl); if (!tr) return { err: 'nouser' }; return { ok: true, id: tr.id, n: tr.name, gem: tr.gem | 0, fown: tr.fown || [], log: (tr.glog || []).slice(-20) }; }
  return { err: 'unknown' }; }
const lockTbl = new Map();
async function handle(path_, d, ip) {
  if (path_ === '/api/ping') return { ok: true, t: Date.now(), store: UP_URL ? 'upstash' : 'file' };
  if (!ipOk(ip)) return { err: 'rate' };
  if (path_ === '/api/top') { await lbLoad(); return lbTop(); }
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
    const lv0 = rec.lv | 0, t0 = rec.upd || 0; rec.save = save; rec.rev++; rec.upd = Date.now(); rec.lv = Math.max(0, Math.min(150, d.lv | 0));
    if (lv0 >= 5 && rec.lv - lv0 >= 25 && rec.upd - t0 < 30 * 60e3) rec.flag = (rec.flag | 0) + 1; // เลเวลขึ้น 25+ ใน 30 นาที = ผิดปกติ
    rec.cls = clean(d.cls, 10); rec.name = clean(d.name, 14) || rec.name;
    if (d.stat && typeof d.stat === 'object') rec.stat = { floor: d.stat.floor | 0, mine: d.stat.mine | 0, kills: d.stat.kills | 0 };
    try { await lbLoad(); const S = rec.stat || {}, X = d.stat || {}; LB.map[lid] = { n: rec.name, lv: rec.lv, cls: rec.cls, fl: lbN(S.floor, 999), k: lbN(S.kills, 1e8), b: lbN(X.boss, 1e7), w: lbN(X.w, 1e12), t: clean(X.t, 16), av: lbAv(X.av), flag: (rec.flag | 0) >= 2 ? 1 : 0, u: Date.now() };
      const ks = Object.keys(LB.map); if (ks.length > 5000) { ks.sort((p, q) => LB.map[p].u - LB.map[q].u); for (const k of ks.slice(0, ks.length - 5000)) delete LB.map[k]; } LB.dirty = true; } catch (e) {}
    try { await gLoad(); gTouchMember(lid, rec.name, rec.lv); } catch (e) {}
    if (!await dbSet(lid, rec)) return { err: 'store' };
    return { ok: true, rev: rec.rev, upd: rec.upd };
  }
  if (path_ === '/api/guild') return guildOp(lid, rec, d);
  if (path_ === '/api/gem') return gemOp(lid, rec, d);
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
// v4.64: เพิ่มเหรียญแฟชั่นจากระบบเซิร์ฟเวอร์ (บอสโลก)
async function gemAdd(lid, n, why) { try { const rec = await dbGet(String(lid || '').toLowerCase()); if (!rec) return false; n = Math.max(0, Math.min(1000, n | 0)); if (!n) return false; rec.gem = (rec.gem | 0) + n; gemLog(rec, n, why || 'sys'); return dbSet(String(lid).toLowerCase(), rec); } catch (e) { return false; } }
module.exports = { gemAdd, middleware, handle, GM_IDS, verify, mailAdd, mailTake, guildOf, guildOfSync, setGuildHook: fn => { GD.hook = fn; } };
