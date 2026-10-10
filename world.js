// ตำนานเอลโดเรีย — ระบบออนไลน์ส่วนกลาง: บอสโลก (12:00 / 20:00 เวลาไทย) · ประมูลของหายาก · แผงร้านผู้เล่นในตลาด
const fs = require('fs'), path = require('path');
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data'), FILE = path.join(DATA, 'world.json');
const WB_HOURS = (process.env.WB_HOURS || '12,20').split(',').map(Number), WB_DUR = 30 * 60e3, WB_HP = +process.env.WB_HP || 4500000; // v4.64: เลือดสำหรับ ~15 คน (3 ปาร์ตี้)
const AUC_DUR = 2 * 3600e3;
let H = null; // { players, send, broadcast, ACC, clean, num }
const S = { wb: { on: false, hp: 0, max: 0, end: 0, slot: '', dmg: {}, warned: '' }, lots: [], nextLot: 1 };
try { const j = JSON.parse(fs.readFileSync(FILE, 'utf8')); if (j && Array.isArray(j.lots)) { S.lots = j.lots; S.nextLot = j.nextLot || 1; } if (j && j.slot) S.wb.slot = j.slot; } catch (e) {}
// v4.71: เดิมเก็บแค่ไฟล์ในเครื่อง → Render deploy/รีสตาร์ตแล้วของประมูล (และคนชนะ) หายหมด — ตอนนี้เก็บ Upstash ด้วย (eld:world)
let kvT = null;
const save = () => { const st = { lots: S.lots, nextLot: S.nextLot, slot: S.wb.slot, t: Date.now() }; try { fs.mkdirSync(DATA, { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(st)); } catch (e) {}
  if (H && H.ACC && H.ACC.kvSet && !kvT) kvT = setTimeout(() => { kvT = null; H.ACC.kvSet('eld:world', { lots: S.lots, nextLot: S.nextLot, slot: S.wb.slot, t: Date.now() }); }, 800); };
const LOOT = [
  { k: 'mount', id: 'drake', nm: '🐉 มังกรเวหาอเวจี (สัตว์ขี่บิน)', min: 60000 },
  { k: 'mount', id: 'pegasus', nm: '🪽 เพกาซัสสายฟ้า (สัตว์ขี่บิน)', min: 35000 },
  { k: 'gear', id: 'sword5', e: 12, nm: '⚔️ ดาบเพชร +12', min: 50000 }, { k: 'gear', id: 'bow5', e: 12, nm: '🏹 ธนูเพชร +12', min: 50000 },
  { k: 'gear', id: 'staff5', e: 12, nm: '🔮 คทาเพชร +12', min: 50000 }, { k: 'gear', id: 'chest5', e: 10, nm: '🛡️ เสื้อเกราะเพชร +10', min: 40000 },
  { k: 'gear', id: 'helm5', e: 10, nm: '⛑️ หมวกเพชร +10', min: 30000 }, { k: 'gear', id: 'ring5', e: 10, nm: '💍 แหวนเพชร +10', min: 30000 },
  { k: 'fash', id: 'w:dragon', nm: '🗡️ อาวุธแฟชั่น มังกร', min: 25000 }, { k: 'fash', id: 'w:thunder', nm: '⚡ อาวุธแฟชั่น สายฟ้า', min: 25000 },
  { k: 'mat', id: 'bless', n: 15, nm: '✨ หินพร ×15', min: 20000 }, { k: 'mat', id: 'estone', n: 80, nm: '💠 หินตีบวก ×80', min: 15000 },
  { k: 'mat', id: 'gem', n: 25, nm: '💎 อัญมณี ×25', min: 15000 }];
const th = (t) => { const d = new Date((t || Date.now()) + 7 * 3600e3); return { h: d.getUTCHours(), m: d.getUTCMinutes(), day: d.toISOString().slice(0, 10) }; };
function nextSlot() { const now = Date.now(), d = new Date(now + 7 * 3600e3); let best = Infinity;
  for (let k = 0; k < 2; k++) for (const h of WB_HOURS) { const t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + k, h, 0, 0) - 7 * 3600e3; if (t > now && t < best) best = t; } return best; }
const online = acct => { for (const p of H.players.values()) if (p.acct === acct && p.joined) return p; return null; };
// v4.71 📬 ทุกอย่างเข้ากล่องจดหมายถาวรก่อน แล้วค่อยแจ้งคนที่ออนไลน์ (ผู้เล่นกด "รับ" เอง → ของไม่หายระหว่างโหลด/หลุด)
async function deliver(acct, item) { if (!acct) return; let m = null; try { m = await H.ACC.mailAdd(acct, item); } catch (e) {}
  const p = online(acct); if (!p) return; if (m) { try { H.send(p, { t: 'mbox', list: await H.ACC.mailList(acct), fresh: m.id }); } catch (e) {} }
  else H.send(p, { t: 'mail', list: [Object.assign({ ts: Date.now() }, item)] }); }
function wbState() { const top = Object.values(S.wb.dmg).sort((a, b) => b.d - a.d).slice(0, 5).map(x => [x.n, Math.round(x.d)]);
  return { t: 'wb', on: S.wb.on, hp: Math.max(0, Math.round(S.wb.hp)), max: S.wb.max, end: S.wb.end, top, next: nextSlot(), n: Object.keys(S.wb.dmg).length }; }
function wbSpawn(slot) { S.wb = { on: true, hp: WB_HP, max: WB_HP, start: Date.now(), end: Date.now() + WB_DUR, slot, dmg: {}, warned: S.wb.warned }; save();
  H.broadcast({ t: 'sys', txt: '🐉 บอสโลก "มหาอสูรอัคคีเอลโดเรีย" ปรากฏแล้วที่ลานบอสโลก! มีเวลา 30 นาที — ทุกคนช่วยกันปราบ! (เมนู 🐉 บอสโลก)' }); H.broadcast(wbState()); }
function lotsPublic() { return S.lots.map(l => ({ id: l.id, nm: l.nm, cur: l.cur, by: l.by || '', end: l.end, bids: l.bids || 0, it: l.item ? { k: l.item.k, id: l.item.id, e: l.item.e | 0, n: l.item.n | 0 } : null })); }
function addLots(n) { const pool = LOOT.slice(); for (let i = 0; i < n && pool.length; i++) { const it = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    S.lots.push({ id: S.nextLot++, item: it, nm: it.nm, cur: it.min, by: null, acct: null, bids: 0, end: Date.now() + AUC_DUR }); } save(); }
function wbKill() { S.wb.on = false; S.wb.hp = 0; const list = Object.values(S.wb.dmg).sort((a, b) => b.d - a.d), total = list.reduce((a, b) => a + b.d, 0) || 1;
  // v4.64: 💠 เหรียญแฟชั่นรวม 100/รอบ แจกตามดาเมจ คนละ 10–30 (ไล่จากดาเมจสูงสุด จนกองหมด · ต้องตีอย่างน้อย 1% · เฉพาะบัญชีออนไลน์)
  let pool = 100; for (const x of list) { x.gem = 0; const sh = x.d / total; if (!x.acct || sh < 0.01 || pool <= 0) continue; const g = Math.min(pool, Math.max(10, Math.min(30, Math.round(100 * sh)))); x.gem = g; pool -= g; try { if (H.ACC.gemAdd) H.ACC.gemAdd(x.acct, g, 'wboss'); } catch (e) {} }
  list.forEach((x, i) => { const msg = { t: 'wbwin', rank: i + 1, d: Math.round(x.d), n: list.length, share: x.d / total, gem: x.gem | 0 };
    const p = x.id && H.players.get(x.id); if (p && p.joined) H.send(p, msg); else if (x.acct) deliver(x.acct, { k: 'wbwin', rank: i + 1, d: Math.round(x.d), n: list.length, share: x.d / total, gem: x.gem | 0 }); });
  addLots(3);
  H.broadcast({ t: 'sys', txt: '🏆 บอสโลกถูกปราบแล้ว! ผู้ร่วมรบ ' + list.length + ' คน · อันดับ 1: ' + (list[0] ? list[0].n : '-') + (list[1] ? ' · 2: ' + list[1].n : '') + (list[2] ? ' · 3: ' + list[2].n : '') + ' — ของหายาก 3 ชิ้นเข้าโรงประมูลแล้ว (2 ชม.)' });
  H.broadcast(wbState()); H.broadcast({ t: 'alots', lots: lotsPublic() }); }
function init(h) { H = h;
  // v4.71: โหลดสถานะโรงประมูลจาก Upstash (รอดการ deploy) — ใช้ชุดที่ใหม่กว่าไฟล์ในเครื่อง
  try { if (H.ACC && H.ACC.kvGet) H.ACC.kvGet('eld:world').then(j => { if (!j || !Array.isArray(j.lots)) return; let loc = 0; try { loc = JSON.parse(fs.readFileSync(FILE, 'utf8')).t || 0; } catch (e) {}
    if (S.lots.length && loc >= (j.t || 0)) return; const ids = new Set(S.lots.map(l => l.id)); for (const l of j.lots) if (!ids.has(l.id)) S.lots.push(l); S.nextLot = Math.max(S.nextLot, j.nextLot || 1); if (j.slot && !S.wb.slot) S.wb.slot = j.slot; console.log('world: restored', j.lots.length, 'lots'); }).catch(() => {}); } catch (e) {}
  setInterval(() => { try { const n = Date.now(), t = th(n);
      for (const h of WB_HOURS) { const slot = t.day + '@' + h;
        if (!S.wb.on && t.h === h && t.m < 30 && S.wb.slot !== slot) wbSpawn(slot);
        if (t.h === (h + 23) % 24 && t.m >= 50 && S.wb.warned !== slot) { S.wb.warned = slot; H.broadcast({ t: 'sys', txt: '⏰ อีก ' + (60 - t.m) + ' นาที บอสโลกจะปรากฏ (' + h + ':00 น.) — เตรียมตัวที่ลานบอสโลก!' }); } }
      if (S.wb.on && n > S.wb.end) { S.wb.on = false; H.broadcast({ t: 'sys', txt: '💨 บอสโลกหนีไปแล้ว... ครั้งหน้าต้องช่วยกันให้มากกว่านี้!' }); H.broadcast(wbState()); }
      let ch = false; for (const l of S.lots.slice()) if (n > l.end) { ch = true; S.lots.splice(S.lots.indexOf(l), 1);
        if (l.acct) { deliver(l.acct, { k: 'auc', item: l.item, nm: l.nm, paid: l.cur }); H.broadcast({ t: 'sys', txt: '🔨 ' + l.by + ' ชนะการประมูล ' + l.nm + ' ด้วย ' + l.cur.toLocaleString() + ' เหรียญ!' }); } }
      if (ch) { save(); H.broadcast({ t: 'alots', lots: lotsPublic() }); }
    } catch (e) { console.log('world tick', e.message); } }, 5000);
  setInterval(() => { if (!S.wb.on) return; const m = JSON.stringify(wbState()); for (const p of H.players.values()) if (p.joined && p.ws.readyState === 1 && (p.sc === 'wboss' || !p.wbT0 || Date.now() - p.wbT0 > 10000)) { if (p.sc !== 'wboss') p.wbT0 = Date.now(); p.ws.send(m); } }, 1000);
}
// คืน true ถ้าจัดการข้อความแล้ว
function onMsg(p, d, now) {
  const { send, clean, num, ACC } = H;
  switch (d.t) {
    case 'auth': ACC.verify(d.id, d.token).then(async v => { if (!v) { send(p, { t: 'auth_no' }); return; } p.acct = v.lid; p.gm = v.gm; try { const g = await ACC.guildOf(v.lid); p.gid = g ? g.id : ''; p.gtag = g ? g.tag : ''; p.gname = g ? g.name : ''; } catch (e) {} send(p, { t: 'auth_ok', gm: v.gm, g: p.gid ? { id: p.gid, tag: p.gtag, name: p.gname } : null });
        try { const m = await ACC.mailList(v.lid); send(p, { t: 'mbox', list: m }); } catch (e) {}
        try { if (v.gm && ACC.topPend) { const n = await ACC.topPend(); if (n) send(p, { t: 'gmtop', n }); } } catch (e) {} }).catch(() => {}); return true;
    case 'mlist': if (!p.acct) return true; ACC.mailList(p.acct).then(m => send(p, { t: 'mbox', list: m })).catch(() => {}); return true;
    case 'mclaim': { if (!p.acct) return true; const now2 = Date.now(); if (p.mcT && now2 - p.mcT < 700) return true; p.mcT = now2;
      const ids = d.all ? 'all' : (Array.isArray(d.ids) ? d.ids.slice(0, 100).map(x => clean(String(x), 20)) : []);
      ACC.mailClaim(p.acct, ids).then(async got => { send(p, { t: 'mgot', list: got }); send(p, { t: 'mbox', list: await ACC.mailList(p.acct) }); }).catch(() => {}); return true; }
    case 'wbq': send(p, wbState()); return true;
    case 'wbhit': { if (!S.wb.on || p.sc !== 'wboss' || !p.st || p.st.dead) return true;
      if (!p.wbw || now - p.wbw > 1000) { p.wbw = now; p.wbu = 0; } const cap = 800 + p.st.lv * 160 - (p.wbu || 0); if (cap <= 0) return true;
      const dmg = num(d.dmg, 0, cap); if (!dmg) return true; p.wbu += dmg;
      const key = p.acct || ('g:' + p.name); const r = S.wb.dmg[key] || (S.wb.dmg[key] = { n: p.name, d: 0, acct: p.acct || null, id: p.id }); r.d += dmg; r.id = p.id; r.n = p.name;
      S.wb.hp -= dmg; if (S.wb.hp <= 0) wbKill(); return true; }
    case 'wbgm': if (p.gm && !S.wb.on) wbSpawn('gm@' + now); return true;
    case 'alist': send(p, { t: 'alots', lots: lotsPublic() }); return true;
    case 'abid': { const l = S.lots.find(x => x.id === (d.id | 0)); if (!p.acct) { send(p, { t: 'abid_no', why: 'ต้องเข้าสู่ระบบบัญชีออนไลน์ก่อนประมูล' }); return true; }
      if (!l || now > l.end) { send(p, { t: 'abid_no', why: 'การประมูลนี้จบแล้ว' }); return true; }
      if (l.acct === p.acct) { send(p, { t: 'abid_no', why: 'คุณเป็นผู้ให้ราคาสูงสุดอยู่แล้ว' }); return true; }
      const need = l.bids ? Math.ceil(l.cur * 1.05) : l.cur, amt = Math.floor(num(d.amt, 0, 5e8)); if (amt < need) { send(p, { t: 'abid_no', why: 'ต้องให้อย่างน้อย ' + need.toLocaleString() }); return true; }
      if (l.acct) deliver(l.acct, { k: 'coin', n: l.cur, why: 'ถูกประมูลแซง: ' + l.nm });
      l.cur = amt; l.by = p.name; l.acct = p.acct; l.bids = (l.bids || 0) + 1; if (l.end - now < 60e3) l.end = now + 60e3; save();
      send(p, { t: 'abid_ok', id: l.id, amt, nm: l.nm }); H.broadcast({ t: 'alots', lots: lotsPublic() }); return true; }
    case 'stall': { if (!d.ti || !Array.isArray(d.items) || p.sc !== 'market') { p.stall = null; return true; }
      p.stall = { ti: clean(d.ti, 24), items: d.items.slice(0, 12).map(x => ({ i: num(x.i, 0, 1e9) | 0, k: x.k === 'gear' ? 'gear' : 'mat', id: clean(x.id, 24), n: Math.max(1, num(x.n, 1, 9999) | 0), p: Math.max(1, num(x.p, 1, 1e8) | 0), nm: clean(x.nm, 30), e: num(x.e, 0, 30) | 0 })) }; return true; }
    case 'sget': { const s = H.players.get(d.id | 0); send(p, { t: 'sitems', id: d.id | 0, ti: s && s.stall ? s.stall.ti : '', name: s ? s.name : '', items: s && s.stall && s.sc === p.sc ? s.stall.items : [] }); return true; }
    case 'sbuy': { const s = H.players.get(d.id | 0), it = s && s.stall && s.stall.items.find(x => x.i === (d.i | 0));
      if (!s || s === p || !it || s.sc !== 'market' || p.sc !== 'market' || (d.p | 0) !== it.p) { send(p, { t: 'sgot', ok: false, from: d.id | 0, i: d.i | 0 }); return true; }
      s.stall.items = s.stall.items.filter(x => x !== it); send(s, { t: 'ssold', i: it.i, by: p.id, bn: p.name, item: it }); send(p, { t: 'sgot', ok: true, from: s.id, sn: s.name, item: it }); return true; }
  }
  return false;
}
function onClose(p) { p.stall = null; }
module.exports = { init, onMsg, onClose, S, wbSpawn, wbKill };
