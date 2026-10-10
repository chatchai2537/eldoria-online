// ตำนานเอลโดเรีย — โลกร่วมกัน: ส่งต่อข้อมูลในฉากเดียวกัน (มอนร่วม/เอฟเฟกต์สกิล) · ระบบปาร์ตี้ (สูงสุด 5 คน)
let H = null; // { players, send, clean, num, filt }
const PARTY_MAX = 5;
const parties = new Map(); let nextParty = 1;
const RELAY_K = new Set(['ms', 'mn', 'mf', 'mall', 'mk', 'md', 'mh', 'mreq', 'zp', 'fx', 'pj', 'pe', 'sk']);
function init(h) { H = h; const iv = setInterval(tick, 1000); if (iv.unref) iv.unref(); }
const byId = id => H.players.get(+id);
function info(pt) { const mem = []; for (const id of pt.mem) { const p = byId(id); if (!p) continue; const s = p.st || {};
  mem.push({ id: p.id, name: p.name, lv: s.lv || 1, cls: s.cls || '', hpP: s.hpP == null ? 100 : s.hpP, sc: p.sc || '', dead: !!s.dead, x: Math.round(s.x || 0), y: Math.round(s.y || 0) }); }
  return { t: 'pty', id: pt.id, lead: pt.lead, mem }; }
function push(pt) { const m = info(pt); for (const id of pt.mem) { const p = byId(id); if (p) H.send(p, m); } }
function leave(p, why) { const pt = p.party && parties.get(p.party); p.party = 0; if (!pt) return; pt.mem.delete(p.id);
  H.send(p, { t: 'pty', id: 0, mem: [] });
  if (pt.mem.size <= 1) { for (const id of pt.mem) { const o = byId(id); if (o) { o.party = 0; H.send(o, { t: 'pty', id: 0, mem: [] }); H.send(o, { t: 'sys', txt: '👥 ปาร์ตี้ถูกยุบ' }); } } parties.delete(pt.id); return; }
  if (pt.lead === p.id) pt.lead = [...pt.mem][0];
  for (const id of pt.mem) { const o = byId(id); if (o) H.send(o, { t: 'sys', txt: '👥 ' + p.name + (why || ' ออกจากปาร์ตี้') }); }
  push(pt); }
function tick() { for (const pt of parties.values()) push(pt); }
// เจ้าของฉาก (โฮสต์มอน) = ผู้เล่นที่อยู่ในฉากนั้นนานสุด
const FX_K = new Set(['fx', 'pj', 'pe', 'sk']);
const hostOf = new Map(); // sc -> id
// v4.72: โฮสต์ค้าง (พับแท็บ/เครื่องหลับ/ไคลเอนต์รุ่นเก่า — ไม่ส่งข้อมูลมอน) ที่คนในฉากแจ้งมา (hstale) → ข้ามไป 60 วิ แล้วเลือกคนถัดไป
const badHost = new Map(); // sc -> Map(id -> เวลาที่ถูกแจ้ง)
const isBad = (sc, id, now) => { const m = badHost.get(sc), t = m && m.get(id); return !!t && now - t < 60000; };
function hostFor(sc, list) { if (!sc || /^(town|shop|market|arena|duel|home|tower)/.test(sc)) return 0; // v4.72: ลานบอสโลก (wboss) มีโฮสต์แล้ว → ทุกคนเห็นบอสตัวเดียวกัน
  const now = Date.now(); let h = hostOf.get(sc); if (h && !isBad(sc, h, now) && list.some(p => p.id === h)) return h;
  const good = list.filter(p => !isBad(sc, p.id, now)), c = good.length ? good : list;
  h = c.length ? c.reduce((a, b) => (a.scT || 0) <= (b.scT || 0) ? a : b).id : 0; hostOf.set(sc, h); return h; }
function cleanHosts(byScene) { for (const sc of [...hostOf.keys()]) if (!byScene.has(sc)) hostOf.delete(sc); for (const sc of [...badHost.keys()]) if (!byScene.has(sc)) badHost.delete(sc); }
function onMsg(p, d, now) {
  if (d.t === 'hstale') { // คนดูแจ้งว่าโฮสต์ของฉากไม่ส่งข้อมูลมอนมาเกิน 3 วิ (แจ้งได้ 1 ครั้ง/5 วิ/คน · ต้องระบุโฮสต์ปัจจุบันให้ตรง)
    const h = hostOf.get(p.sc); if (p.joined && p.sc && h && h !== p.id && (d.h | 0) === h && now - (p.hsT || 0) > 5000) { p.hsT = now; let m = badHost.get(p.sc); if (!m) badHost.set(p.sc, m = new Map()); m.set(h, now); }
    return true; }
  if (d.t === 'sx') { // ส่งต่อให้ทุกคนในฉากเดียวกัน (หรือคนเดียวถ้ามี to)
    const k = String(d.k || ''); if (!RELAY_K.has(k) || !p.sc || !p.joined) return true;
    d.from = p.id; d.sc = p.sc; const s = JSON.stringify(d);
    if (d.to) { const o = byId(d.to); if (o && o.sc === p.sc && o.ws.readyState === 1) o.ws.send(s); return true; }
    // v4.47: เอฟเฟกต์สกิล/กระสุนผู้เล่น (ภาพล้วน) ส่งเฉพาะคนในระยะ 1400px · ข้อมูลมอนร่วมยังส่งทั้งฉาก
    const near = FX_K.has(k) && p.st ? 1400 * 1400 : 0;
    for (const o of H.players.values()) if (o !== p && o.sc === p.sc && o.joined && o.ws.readyState === 1) { if (near && o.st) { const ex = o.st.x - p.st.x, ey = o.st.y - p.st.y; if (ex * ex + ey * ey > near) continue; } o.ws.send(s); }
    return true; }
  if (d.t === 'pinv') { const to = H.findByName(H.clean(d.name, 14)); if (!to || to === p) { H.send(p, { t: 'sys', txt: '👥 ไม่พบผู้เล่นชื่อนี้ที่ออนไลน์' }); return true; }
    if (to.party) { H.send(p, { t: 'sys', txt: '👥 ' + to.name + ' อยู่ในปาร์ตี้อื่นแล้ว' }); return true; }
    const pt = p.party && parties.get(p.party); if (pt && pt.mem.size >= PARTY_MAX) { H.send(p, { t: 'sys', txt: '👥 ปาร์ตี้เต็มแล้ว (' + PARTY_MAX + ' คน)' }); return true; }
    if (pt && pt.lead !== p.id) { H.send(p, { t: 'sys', txt: '👥 หัวหน้าปาร์ตี้เท่านั้นที่เชิญได้' }); return true; }
    to.pinv = { from: p.id, t: now }; H.send(to, { t: 'pinv', from: p.id, name: p.name, lv: p.st ? p.st.lv : 1 }); H.send(p, { t: 'sys', txt: '👥 ส่งคำเชิญถึง ' + to.name + ' แล้ว' }); return true; }
  if (d.t === 'pans') { const inv = p.pinv; p.pinv = null; if (!inv || now - inv.t > 60000 || +d.from !== inv.from) return true; const lead = byId(inv.from); if (!lead) return true;
    if (!d.ok) { H.send(lead, { t: 'sys', txt: '👥 ' + p.name + ' ปฏิเสธคำเชิญ' }); return true; }
    if (p.party) leave(p);
    let pt = lead.party && parties.get(lead.party); if (!pt) { pt = { id: nextParty++, lead: lead.id, mem: new Set([lead.id]) }; parties.set(pt.id, pt); lead.party = pt.id; }
    if (pt.mem.size >= PARTY_MAX) { H.send(p, { t: 'sys', txt: '👥 ปาร์ตี้เต็มแล้ว' }); return true; }
    pt.mem.add(p.id); p.party = pt.id; for (const id of pt.mem) { const o = byId(id); if (o) H.send(o, { t: 'sys', txt: '👥 ' + p.name + ' เข้าร่วมปาร์ตี้' }); } push(pt); return true; }
  if (d.t === 'pleave') { leave(p); return true; }
  if (d.t === 'pkick') { const pt = p.party && parties.get(p.party); const o = byId(d.id); if (!pt || pt.lead !== p.id || !o || o.party !== pt.id || o === p) return true; leave(o, ' ถูกเชิญออกจากปาร์ตี้'); H.send(o, { t: 'sys', txt: '👥 คุณถูกเชิญออกจากปาร์ตี้' }); return true; }
  if (d.t === 'plead') { const pt = p.party && parties.get(p.party); const o = byId(d.id); if (!pt || pt.lead !== p.id || !o || o.party !== pt.id) return true; pt.lead = o.id; push(pt); return true; }
  if (d.t === 'pchat') { const pt = p.party && parties.get(p.party); if (!pt) { H.send(p, { t: 'sys', txt: '👥 ยังไม่มีปาร์ตี้' }); return true; } if (now - (p.pcT || 0) < 500) return true; p.pcT = now;
    const txt = H.filt(H.clean(d.txt, 140)); if (!txt) return true; const m = { t: 'chat', ch: 'party', id: p.id, name: p.name, txt, ts: now };
    for (const id of pt.mem) { const o = byId(id); if (o && o !== p) H.send(o, m); } return true; }
  return false; }
function onClose(p) { if (p.party) leave(p, ' ออฟไลน์'); }
module.exports = { init, onMsg, onClose, hostFor, cleanHosts };
