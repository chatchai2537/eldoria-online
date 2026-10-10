// fix82 (v4.72) — งานจากเจ้าของ 2026-10-10 23:18 (HANDOFF S1–S5)
//  A) เมนูตัวละครมี 🌐 ซ้ำ 2 ปุ่ม ("ผู้คน" กับ "ออนไลน์") → เหลือ "🌐 ผู้คน" ปุ่มเดียว (โชว์จำนวนคนออนไลน์บนปุ่ม)
//  B) ยาเลือด + อาหารที่ฟื้นเลือด: คูลดาวน์ร่วม 8 วิ (เดิมกดรัวได้ไม่จำกัด) · ตัวเลขนับถอยหลังบนช่อง H · ยามานาไม่เปลี่ยน
//  C) 🐉 บอสโลกตัวเดียวกันทุกจอ: ลานบอสโลกใช้ระบบโฮสต์/คนดูของ fix33 (W33) — โฮสต์ (เซิร์ฟเวอร์เลือก = คนที่อยู่ในลานนานสุด) คุมตำแหน่ง/ท่าโจมตี
//     คนอื่นเห็นบอสตัวเดียวกัน ไล่คนเดียวกัน · เลือดบอสยังยึดเซิร์ฟเวอร์ (wbhit/wb เหมือนเดิม) · ตายพร้อมกันทุกจอเมื่อเซิร์ฟเวอร์ยืนยัน
//     ค่าพลังบอส (เลเวล/พลังโจมตี) ยังคิดตามเลเวลผู้เล่นแต่ละคนเหมือนเดิม (โฮสต์ส่ง ha = พลังโจมตีฝั่งโฮสต์ มากับ mh ให้ปลายทางปรับสัดส่วน)
//     ต้องใช้ party.js ใหม่ (ให้ฉาก wboss มีโฮสต์) — เซิร์ฟเวอร์เก่า h=0 → ทำงานแบบเดิม (ต่างคนต่างเห็น)
//  D) มอน/บอสในฉากที่แชร์กัน (เหมือง/ดันเจี้ยน/แมพ) ตาย: คนที่ไม่ได้ตีก็เห็นเอฟเฟกต์ตาย+เสียงเหมือนคนตี (เดิมมอนหายไปเฉย ๆ)
try{
// ---------- A) เมนูตัวละคร: 🌐 เหลือปุ่มเดียว ----------
try{const i=PM7.findIndex(m=>m[1]==='ออนไลน์');if(i>=0)PM7.splice(i,1);
 const _r=pmRender7;pmRender7=function(){const m=PM7.find(x=>x[1]==='ผู้คน');
  if(m&&typeof NET!=='undefined'&&NET.on&&NET.n>0){m[1]='ผู้คน '+NET.n;try{return _r.apply(this,arguments)}finally{m[1]='ผู้คน'}}
  return _r.apply(this,arguments)};window.pmRender7=pmRender7;pmRender7()}catch(e){console.warn('fix82A',e)}

// ---------- B) คูลดาวน์ของฟื้นเลือด ----------
const HPCD82={until:0,sec:8,msgT:0};window.HPCD82=HPCD82;
const hpItem82=k=>k==='hpp'||!!(typeof FOOD!=='undefined'&&FOOD[k]&&FOOD[k].hpP>0);
{const _ui=useItem;useItem=function(k){if(!hpItem82(k))return _ui.apply(this,arguments);
  const now=performance.now();
  if(now<HPCD82.until){const auto=typeof AUTO!=='undefined'&&AUTO.on;
   if(!auto&&now-HPCD82.msgT>900){HPCD82.msgT=now;try{say('⏳ ของฟื้นเลือดคูลดาวน์อีก '+Math.ceil((HPCD82.until-now)/1000)+' วิ');sfx('thud')}catch(e){}}return}
  const n0=inv[k]|0,r=_ui.apply(this,arguments);
  if((inv[k]|0)<n0)HPCD82.until=performance.now()+HPCD82.sec*1000;
  return r};window.useItem=useItem}
try{const el=gid('qh');if(el&&!gid('qhcd82')){const c=document.createElement('i');c.id='qhcd82';
  c.style.cssText='position:absolute;left:0;top:0;right:0;bottom:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.62);border-radius:6px;font:900 16px system-ui;font-style:normal;color:#fff;pointer-events:none;z-index:2';
  el.insertBefore(c,el.firstChild); // ห้ามต่อท้าย: ตัวนับจำนวนเดิมเขียนลง el.lastChild
  setInterval(()=>{try{const left=HPCD82.until-performance.now();if(left>0){c.style.display='flex';c.textContent=Math.ceil(left/1000)}else if(c.style.display!=='none')c.style.display='none'}catch(e){}},200)}}catch(e){console.warn('fix82B',e)}

// ---------- C) บอสโลกตัวเดียวกันทุกจอ ----------
const WB82={mode:'solo',D:null,h:0,rxT:0,rep:0,bad:{}};window.WB82=WB82;
const myAtk82=()=>Math.round(mobStats(Math.min(110,P.lv+6),'dragon',0,1).atk*.8);
const byUid82=uid=>{if(!D||!D.mobs||!uid)return null;for(const m of D.mobs)if(m.uid===uid)return m;return null};
// บอสที่รับมาจากโฮสต์: ใช้ค่าพลังตามเลเวลเราเอง (เหมือนตอนต่างคนต่างตี) · เลือดยึดเซิร์ฟเวอร์
function local82(b){b.L=Math.min(110,P.lv+8);b.atk=myAtk82();b.max=WB10.max||b.max;b.hp=Math.max(1,WB10.hp||b.hp);b.lh=b.hp;b.my33=0;b.pend33=0;b.summoned=2;b.loc82=NET.id||1} // loc82 = ไอดีเรา (ค่านี้ถูกส่งต่อไปกับข้อมูลมอน จึงต้องเทียบกับไอดีตัวเอง)
const isLoc82=b=>!!(b&&b.loc82&&b.loc82===(NET.id||1));
function wbSnap82(d){
 if(!inWb10()){WB82.mode='solo';WB82.D=null;return}
 const h=d.h|0,now=performance.now();let want='solo';
 if(WB82.D!==D){WB82.D=D;WB82.mode='solo';WB82.bad={};WB82.h=-1}
 if(h!==WB82.h){WB82.h=h;WB82.rxT=now;WB82.rep=0}
 if(NET.on&&h&&WB10.on&&!WB82.bad[h])want=(h===NET.id||!(d.ps&&d.ps.length))?'host':'mirror';
 // โฮสต์ค้าง (พับจอ/เครื่องหลับ/ไคลเอนต์รุ่นเก่า): ไม่ได้ตำแหน่งบอสเกิน 3 วิ → แจ้งเซิร์ฟเวอร์ให้เลือกโฮสต์ใหม่ · เกิน 6.5 วิ → เลิกรอ กลับไปคุมบอสเองแบบเดิม
 if(want==='mirror'&&WB82.mode==='mirror'){const idle=now-WB82.rxT;
  if(idle>3000&&!WB82.rep){WB82.rep=1;netSend({t:'hstale',h})}
  if(idle>6500){WB82.bad[h]=1;want='solo'}}
 W33.mode=WB82.mode; // fix33 ไม่รู้จักฉาก wboss จึงตั้งกลับเป็น solo ทุก snap → คืนโหมดของเราก่อน แล้วค่อยเปลี่ยนถ้าจำเป็น
 if(want!==WB82.mode){setMode33(want);WB82.mode=want;WB82.rxT=now}
 if(want!=='mirror'&&!D.boss&&WB10.on&&!WB10.killed)wbSpawnLocal10()} // โฮสต์/เล่นเดี่ยวที่ยังไม่มีบอส (เช่น รับช่วงต่อ) → สร้างเอง
{const _nm=netMsg;netMsg=function(d){const r=_nm.apply(this,arguments);try{if(d&&d.t==='snap')wbSnap82(d)}catch(e){}return r};window.netMsg=netMsg}
// คนดูไม่สร้างบอสเอง (รอชุดเดียวกับโฮสต์)
// + กันบั๊กเดิม: บอสโลกเลือด <50% จะเรียกลูกน้องจากรายชื่อมอนของแมพ (ลานบอสโลกไม่มี) → error ทุกครั้ง · ตั้ง summoned=2 = ข้ามท่าเรียกลูกน้อง
{const _sp=wbSpawnLocal10;wbSpawnLocal10=function(){if(WB82.mode==='mirror'&&inWb10())return;const r=_sp.apply(this,arguments);try{const b=D&&D.boss;if(b&&b.wb10)b.summoned=2}catch(e){}return r};window.wbSpawnLocal10=wbSpawnLocal10}
// โฮสต์แนบพลังโจมตีของบอสฝั่งตัวเองไปกับดาเมจที่ส่งให้คนอื่น → ปลายทางปรับตามเลเวลตัวเอง
{const _ns=netSend;netSend=function(o){try{if(o&&o.t==='sx'&&o.k==='mh'&&inWb10()){const b=D.boss;if(b&&b.wb10&&b.atk>0)o.ha=b.atk}}catch(e){}return _ns.apply(this,arguments)};window.netSend=netSend}
function deathFx82(m){try{if(!m||Math.hypot(P.x-m.x,P.y-m.y)>900)return;sfx('splat');
  for(let i=0;i<(m.boss?40:12);i++)fx.push({x:m.x,y:m.y-12*(m.sc||1),vx:(Math.random()-.5)*(m.boss?260:140),vy:-40-Math.random()*(m.boss?160:90),l:.7,c:m.boss?'255,216,74':'220,200,180'});
  if(m.boss){try{say('🏆 '+m.nm+' ถูกปราบแล้ว!')}catch(e){}sfx('chest')}}catch(e){}}
window.deathFx82=deathFx82;
{const _o=onSx33;onSx33=function(d){const k=d&&d.k;
  // D) คนดูที่ไม่ได้ตี: มอนตายให้เห็นเอฟเฟกต์เหมือนคนตี (ทุกฉากที่แชร์มอน)
  if(k==='mk'){const m=byUid82(d.uid);
   if(m&&m.wb10)return; // บอสโลกตายเมื่อเซิร์ฟเวอร์ยืนยันเท่านั้น (ข้อความ wb) — ไม่ฟัง mk จากโฮสต์
   const was=!m||m.dead,hit=m&&m.my33>0,r=_o.apply(this,arguments);if(m&&!was&&m.dead&&!hit)deathFx82(m);return r}
  if(!inWb10())return _o.apply(this,arguments);
  if(k==='ms'&&d.from===W33.host)WB82.rxT=performance.now();
  if(k==='md'){const m=byUid82(d.uid);if(m&&m.wb10){ // เลือดบอสโลกเป็นของเซิร์ฟเวอร์ — โฮสต์รับแค่ "ใครตี" ไว้เลือกเป้า
    if(W33.mode==='host'&&!m.dead&&d.sc===netScene()){m.aggro=1;m.tgt33=d.from;if(m.st==='idle')m.st='chase';
     try{const dmg=Math.max(0,Math.min(5e7,+d.dmg||0));dmgTxt(m.x+(Math.random()-.5)*10,m.y-(m.F?26*m.sc:24),(d.cr?'💥':'')+Math.round(dmg),d.cr?'#ffd84a':'#cfe8ff',!!d.cr)}catch(e){}}return}}
  if(k==='mh'&&d.ha>0){try{d.dmg=Math.max(1,Math.round((+d.dmg||1)*myAtk82()/d.ha))}catch(e){}}
  const b0=D.boss,keep=b0&&b0.wb10&&isLoc82(b0),hp0=keep?b0.hp:0,lh0=keep?b0.lh:0;
  const r=_o.apply(this,arguments);
  try{const b=D&&D.boss;if(b&&b.wb10&&W33.mode==='mirror'){if(b===b0&&keep){b.hp=hp0;b.lh=lh0}else if(!isLoc82(b))local82(b)}}catch(e){}
  return r};window.onSx33=onSx33}
// บอสโลกตาย = เซิร์ฟเวอร์ยืนยัน (WB10.killed) → ทุกจอได้ฉากตาย+รางวัลเต็มเหมือนเดิม ไม่ว่าจะเป็นโฮสต์หรือคนดู
// มอนอื่น: โฮสต์ที่ไม่ได้ตีก็เห็นเอฟเฟกต์ตาย
{const _mk=mobKill;mobKill=function(m){
  if(m&&m.wb10&&typeof inWb10==='function'&&inWb10()){
   // แก้บั๊กเดิม: ตัวเดิมดันเลือดกลับเป็น 1 → ดาเมจที่ส่งขึ้นเซิร์ฟเวอร์ขาดไป 1 เสมอ บอสค้างที่ 1 HP (ตายได้ก็ต่อเมื่อหลายคนตีพร้อมกัน) → ปล่อยเป็น 0 ให้ส่งดาเมจครบ
   if(!WB10.killed){m.dead=false;m.hp=Math.max(0,m.hp);return}
   m.ok33=1;m.my33=m.my33>0?m.my33:1;const r=_mk.apply(this,arguments);try{if(D){D.boss=null;D.bossT=1e9}}catch(e){}return r}
  let pre=false;try{pre=!!(m&&!m.dead&&m.uid&&W33.mode==='host'&&NET.others.size>0&&!(m.my33>0))}catch(e){}
  const r=_mk.apply(this,arguments);if(pre&&m.dead)deathFx82(m);return r};window.mobKill=mobKill}
}catch(e){console.warn('fix82',e)}
