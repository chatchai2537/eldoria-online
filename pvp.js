// ตำนานเอลโดเรีย — PvP 2.0: ท้าดวล 1v1 (แรงก์/เรตติ้ง ELO) · สนามประลองแบบสะสมแต้ม (สตรีค · บาวน์ตี้ · ลูกพลัง) · อันดับ PvP
const fs = require('fs'), path = require('path');
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
const UP_URL = (process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, ''), UP_TOK = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const DUEL_COUNT = +process.env.DUEL_COUNT || 3000, DUEL_DUR = +process.env.DUEL_DUR || 90000, ORB_MS = +process.env.PVP_ORB_MS || 20000;
let H = null;
// ---------- เรตติ้ง (เอกสารเดียว: Upstash eld:pvp หรือ data/pvp.json) ----------
const RT = { map: {}, dirty: false, loaded: null };
function rtLoad() { if (RT.loaded) return RT.loaded; RT.loaded = (async () => { try {
  if (UP_URL) { const r = await fetch(UP_URL + '/get/eld:pvp', { headers: { authorization: 'Bearer ' + UP_TOK } }); const j = await r.json(); if (j && j.result) RT.map = JSON.parse(j.result) || {}; }
  else { const f = path.join(DATA, 'pvp.json'); if (fs.existsSync(f)) RT.map = JSON.parse(fs.readFileSync(f, 'utf8')) || {}; }
} catch (e) { console.log('pvpLoad', e.message); } })(); return RT.loaded; }
async function rtFlush() { if (!RT.dirty) return; RT.dirty = false; const body = JSON.stringify(RT.map); try {
  if (UP_URL) await fetch(UP_URL + '/set/eld:pvp', { method: 'POST', headers: { authorization: 'Bearer ' + UP_TOK }, body });
  else { fs.mkdirSync(DATA, { recursive: true }); const f = path.join(DATA, 'pvp.json'), t = f + '.tmp'; fs.writeFileSync(t, body); fs.renameSync(t, f); }
} catch (e) { console.log('pvpFlush', e.message); RT.dirty = true; } }
{ const iv = setInterval(rtFlush, 20000); if (iv.unref) iv.unref(); }
const RANKS = [[0, '🥉 บรอนซ์'], [1100, '🥈 ซิลเวอร์'], [1250, '🥇 โกลด์'], [1400, '💠 แพลทินัม'], [1550, '💎 ไดมอนด์'], [1700, '👑 มาสเตอร์'], [1900, '🔥 ตำนาน']];
const rankOf = r => { let n = RANKS[0][1]; for (const [m, t] of RANKS) if (r >= m) n = t; return n; };
const rec = p => { if (!p.acct) return null; return RT.map[p.acct] || (RT.map[p.acct] = { n: p.name, r: 1000, w: 0, l: 0, d: 0, best: 1000 }); };
const pub = x => x ? { r: Math.round(x.r), w: x.w, l: x.l, d: x.d || 0, rank: rankOf(x.r), best: Math.round(x.best || x.r) } : null;
// ---------- ดวล ----------
const DUELS = new Map(); let nextDuel = 1; const pairT = new Map();
const other = (D, p) => D.a === p ? D.b : D.a;
const inDuelScene = (D, p) => p.sc === 'duel:' + D.id;
function duelOk(p, to) { const D = p.duel && DUELS.get(p.duel); return !!(D && to.duel === D.id && D.st === 'fight' && inDuelScene(D, p) && inDuelScene(D, to)); }
function startDuel(a, b, now) { const D = { id: nextDuel++, a, b, st: 'count', t0: now, fight: now + DUEL_COUNT, end: now + DUEL_COUNT + DUEL_DUR }; DUELS.set(D.id, D); a.duel = b.duel = D.id; a.inv = b.inv = null;
  for (const [p, side] of [[a, 0], [b, 1]]) { const o = other(D, p); H.send(p, { t: 'duelgo', did: D.id, side, count: DUEL_COUNT, dur: DUEL_DUR, opp: { id: o.id, name: o.name, lv: o.st ? o.st.lv : 1, cls: o.st ? o.st.cls : '', pr: pub(o.acct && RT.map[o.acct]) } }); }
  H.broadcast({ t: 'sys', txt: '⚔️ ศึกดวลเริ่มแล้ว! ' + a.name + ' VS ' + b.name }); }
function endDuel(D, w, why) { if (D.st === 'end') return; D.st = 'end'; const now = Date.now(); const l = w ? other(D, w) : null;
  const key = [D.a.acct || D.a.name, D.b.acct || D.b.name].sort().join('|'), recent = now - (pairT.get(key) || 0) < 10 * 60e3; pairT.set(key, now);
  const ranked = !!(D.a.acct && D.b.acct && D.a.acct !== D.b.acct && !recent);
  let dw = 0; const ra = rec(D.a), rb = rec(D.b);
  if (ranked) { const ea = 1 / (1 + Math.pow(10, (rb.r - ra.r) / 400)), sa = !w ? .5 : w === D.a ? 1 : 0, K = 32; dw = K * (sa - ea);
    ra.r = Math.max(0, ra.r + dw); rb.r = Math.max(0, rb.r - dw); for (const [x, p] of [[ra, D.a], [rb, D.b]]) { x.n = p.name; x.cls = p.st ? p.st.cls : ''; x.lv = p.st ? p.st.lv : 1; x.best = Math.max(x.best || 0, x.r); }
    if (!w) { ra.d = (ra.d || 0) + 1; rb.d = (rb.d || 0) + 1; } else { (w === D.a ? ra : rb).w++; (w === D.a ? rb : ra).l++; } RT.dirty = true; }
  for (const p of [D.a, D.b]) { const me = p === D.a ? ra : rb, d = p === D.a ? dw : -dw;
    H.send(p, { t: 'duelend', did: D.id, win: w === p, draw: !w, why, ranked, dr: Math.round(d), me: pub(me), opp: other(D, p).name, honor: recent ? 0 : (!w ? 5 : w === p ? 12 : 4) }); p.duel = 0; }
  H.broadcast({ t: 'sys', txt: !w ? '🤝 ศึกดวล ' + D.a.name + ' VS ' + D.b.name + ' — เสมอ!' : '🏆 ' + w.name + ' ชนะดวล ' + l.name + (why === 'ko' ? ' (น็อก!)' : why === 'time' ? ' (หมดเวลา · เลือดเหลือมากกว่า)' : ' (คู่ต่อสู้หนี)') + (ranked ? ' · เรต ' + Math.round(rec(w).r) + ' (+' + Math.round(Math.abs(dw)) + ')' : '') });
  setTimeout(() => DUELS.delete(D.id), 5000); }
// ---------- สนามประลอง ----------
const AR = { kd: new Map(), orbs: [], nextOrb: 1, orbT: 0, sbDirty: false };
const SPOTS = [[576, 416], [300, 260], [852, 260], [300, 600], [852, 600]], ORBK = ['heal', 'power', 'haste'];
const arenaPlayers = () => [...H.players.values()].filter(o => o.joined && o.sc === 'arena');
const toArena = o => { const s = JSON.stringify(o); for (const p of arenaPlayers()) if (p.ws.readyState === 1) p.ws.send(s); };
const kdOf = p => { let k = AR.kd.get(p.id); if (!k) { k = { n: p.name, k: 0, d: 0, s: 0, best: 0 }; AR.kd.set(p.id, k); AR.sbDirty = true; } k.n = p.name; return k; };
const sbList = () => [...AR.kd.entries()].filter(([id]) => { const p = H.players.get(id); return p && p.sc === 'arena'; }).map(([id, k]) => ({ id, n: k.n, k: k.k, d: k.d, s: k.s })).sort((a, b) => b.k - a.k || a.d - b.d).slice(0, 8);
const STREAK = { 3: '🔥 กำลังเดือด!', 5: '💀 ไร้เทียมทาน!', 8: '👑 เทพสงคราม!', 12: '☠️ ปีศาจสังเวียน!!' };
function arenaKo(p, by) { const v = kdOf(p), k = kdOf(by), vs = v.s; v.d++; v.s = 0; k.k++; k.s++; k.best = Math.max(k.best, k.s); AR.sbDirty = true;
  const bounty = vs >= 5 ? 8 : vs >= 3 ? 4 : 0; H.send(by, { t: 'honor', n: 2 + bounty, why: bounty ? 'ล่าค่าหัว ' + p.name : 'ล้ม ' + p.name, streak: k.s });
  toArena({ t: 'akill', by: by.name, v: p.name, s: k.s, shut: vs >= 3 ? vs : 0 });
  if (STREAK[k.s]) H.broadcast({ t: 'sys', txt: '⚔️ ' + by.name + ' ' + STREAK[k.s] + ' (ล้มติดกัน ' + k.s + ' คนในสนามประลอง)' });
  if (vs >= 3) H.broadcast({ t: 'sys', txt: '🛑 ' + by.name + ' ปิดตำนาน ' + p.name + ' (สตรีค ' + vs + ')!' }); }
// ---------- ข้อความ ----------
function onMsg(p, d, now) {
  const { send, clean } = H;
  switch (d.t) {
    case 'duel': { if (!p.joined || !p.st) return true; if (now - (p.duelT || 0) < 4000) { send(p, { t: 'sys', txt: 'รอสักครู่ก่อนท้าดวลอีกครั้ง' }); return true; } p.duelT = now;
      const n = clean(d.to, 14).toLowerCase(); let to = null; for (const o of H.players.values()) if (o.joined && o !== p && (o.id === +d.id || o.name.toLowerCase() === n)) { to = o; break; }
      if (!to) { send(p, { t: 'sys', txt: 'ไม่พบผู้เล่นที่ออนไลน์อยู่' }); return true; }
      if (p.duel || to.duel) { send(p, { t: 'sys', txt: 'มีคนกำลังดวลอยู่แล้ว' }); return true; }
      to.inv = { from: p.id, t: now }; send(to, { t: 'duelinv', from: p.id, name: p.name, lv: p.st.lv, cls: p.st.cls, pr: pub(p.acct && RT.map[p.acct]) });
      send(p, { t: 'sys', txt: '⚔️ ส่งคำท้าดวลถึง ' + to.name + ' แล้ว — รอตอบรับ (20 วิ)' }); return true; }
    case 'duelans': { const iv = p.inv; p.inv = null; if (!iv || iv.from !== +d.from || now - iv.t > 20000) return true; const a = H.players.get(iv.from); if (!a || !a.joined) return true;
      if (!d.ok) { send(a, { t: 'sys', txt: '🙅 ' + p.name + ' ปฏิเสธคำท้าดวล' }); return true; }
      if (a.duel || p.duel) return true; startDuel(a, p, now); return true; }
    case 'duelquit': { const D = p.duel && DUELS.get(p.duel); if (D) endDuel(D, other(D, p), 'quit'); return true; }
    case 'pvpme': rtLoad().then(() => send(p, { t: 'pvpme', me: pub(p.acct && RT.map[p.acct]), acct: !!p.acct, ranks: RANKS })); return true;
    case 'pvptop': rtLoad().then(() => send(p, { t: 'pvptop', list: top() })); return true;
    case 'aorbtake': { if (p.sc !== 'arena' || !p.st) return true; const i = AR.orbs.findIndex(o => o.id === +d.id); if (i < 0) return true; const o = AR.orbs[i];
      if (Math.hypot(o.x - p.st.x, o.y - p.st.y) > 70) return true; AR.orbs.splice(i, 1); toArena({ t: 'aorbgot', id: o.id, by: p.id, name: p.name, k: o.k }); toArena({ t: 'aorb', orbs: AR.orbs }); return true; }
  }
  return false;
}
function ko(p, byId) { const by = H.players.get(+byId); const D = p.duel && DUELS.get(p.duel);
  if (D) { if (D.st === 'fight') endDuel(D, by && by.duel === D.id ? by : other(D, p), 'ko'); return true; }
  if (p.sc === 'arena' && by && by.sc === 'arena' && by !== p) { arenaKo(p, by); return true; }
  return false; }
function onClose(p) { const D = p.duel && DUELS.get(p.duel); if (D) endDuel(D, other(D, p), 'leave'); AR.kd.delete(p.id); AR.sbDirty = true; }
function top() { return Object.values(RT.map).filter(x => x.w + x.l + (x.d || 0) > 0).sort((a, b) => b.r - a.r).slice(0, 20).map(x => ({ n: x.n, r: Math.round(x.r), w: x.w, l: x.l, cls: x.cls || '', lv: x.lv || 0, rank: rankOf(x.r) })); }
function init(h) { H = h; rtLoad();
  setInterval(() => { const now = Date.now();
    for (const D of DUELS.values()) {
      if (D.st === 'count' && now >= D.fight) { D.st = 'fight'; for (const p of [D.a, D.b]) H.send(p, { t: 'duelfight', did: D.id, end: D.end - now }); }
      else if (D.st === 'fight') {
        for (const p of [D.a, D.b]) { if (inDuelScene(D, p)) p.away = 0; else if (!p.away) p.away = now; else if (now - p.away > 8000) { endDuel(D, other(D, p), 'leave'); break; } }
        if (D.st === 'fight' && now > D.end) { const ha = D.a.st ? D.a.st.hpP : 0, hb = D.b.st ? D.b.st.hpP : 0; endDuel(D, ha === hb ? null : ha > hb ? D.a : D.b, 'time'); } } }
    const ap = arenaPlayers(); for (const p of ap) kdOf(p);
    if (ap.length && now - AR.orbT > ORB_MS && AR.orbs.length < 3) { AR.orbT = now; const used = new Set(AR.orbs.map(o => o.x + ',' + o.y)), free = SPOTS.filter(s => !used.has(s[0] + ',' + s[1]));
      if (free.length) { const s = free[Math.floor(Math.random() * free.length)]; AR.orbs.push({ id: AR.nextOrb++, k: ORBK[Math.floor(Math.random() * ORBK.length)], x: s[0], y: s[1] }); toArena({ t: 'aorb', orbs: AR.orbs }); } }
    if (!ap.length) AR.orbs.length = 0;
    if (AR.sbDirty) { AR.sbDirty = false; toArena({ t: 'arsb', list: sbList() }); }
  }, 250);
  setInterval(() => { if (arenaPlayers().length) { toArena({ t: 'arsb', list: sbList() }); toArena({ t: 'aorb', orbs: AR.orbs }); } }, 3000);
}
module.exports = { init, onMsg, ko, onClose, duelOk, top, rankOf };
