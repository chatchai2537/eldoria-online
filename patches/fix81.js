// fix81 (v4.71) — งานชุดใหม่ 2 (HANDOFF N1–N9): 📬 กล่องจดหมาย · ออกโหมดที่ประตูเดิม · ทางเดินธรรมชาติ (ที่ดิน/ตลาด) · ล็อกขนาดจอ
//   · สกิลลากเล็งแบบ RoV · แจ้ง GM คำขอโดเนท · โรงประมูลเห็นของ · กันจอว่างเครื่องเก่า · ชาวเมืองมีชีวิต (กลางคืนเข้าบ้าน กลางวันเดินเข้าร้าน)
// ทุกอย่างห่อทับของเดิม ไม่แก้โค้ดเก่า (ยกเว้น fix41 1 จุด: `a??.9` → `(a==null?.9:a)` เพื่อให้เครื่องเก่าเปิดได้ — ความหมายเหมือนเดิม)
// ⚠️ ไฟล์นี้ต้องอ่านได้บนเบราว์เซอร์เก่า: ห้ามใช้ ?. ?? และ {...obj}
try{
const W81=window;W81.FIX81=1;
const esc81=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt81=n=>Math.round(n||0).toLocaleString();
const ok81=()=>{try{return !!(NET.on&&NET.ws&&NET.ws.readyState===1)}catch(e){return false}};
const send81=o=>{try{if(ok81())NET.ws.send(JSON.stringify(o))}catch(e){}};

// ===================================================================== CSS
{const st=document.createElement('style');st.textContent=
'.mb81 .it{display:flex;gap:9px;align-items:center;padding:8px;margin-bottom:6px;border-radius:11px;background:rgba(255,255,255,.06);border:1px solid rgba(255,216,74,.25)}'+
'.mb81 .ic{width:44px;height:44px;flex:0 0 44px;border-radius:9px;background:#1b1626;display:flex;align-items:center;justify-content:center;font-size:24px;overflow:hidden}'+
'.mb81 .ic img,.mb81 .ic canvas{max-width:44px;max-height:44px}.mb81 .tx{flex:1;min-width:0}.mb81 .tx b{display:block;font-size:13px}.mb81 .tx small{opacity:.75;font-size:11px}'+
'.mb81 .em{padding:26px 10px;text-align:center;opacity:.75}.mb81 .top{display:flex;gap:6px;align-items:center;margin-bottom:8px}.mb81 .top small{flex:1;opacity:.8}'+
'.au81{border:1px solid #D4AF37;border-radius:11px;padding:8px;background:#221d2c;display:flex;gap:9px}.au81 .pv{width:84px;height:84px;flex:0 0 84px;border-radius:10px;background:radial-gradient(#4a3a6a,#16101f);display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:pointer}'+
'.au81 .pv img{width:58px;height:58px;image-rendering:pixelated}.au81 .pv canvas{max-width:84px;max-height:84px}.au81 .bd2{flex:1;min-width:0}.au81 .st{font-size:11px;color:#bfe3ff;margin:2px 0}'+
'html,body{touch-action:pan-x pan-y;-webkit-text-size-adjust:100%;text-size-adjust:100%}'+
'#fix81e{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:100000;background:#2a0e14;color:#fff;border:1px solid #ff8a8a;border-radius:12px;padding:10px 14px;font:600 13px system-ui,"Noto Sans Thai",sans-serif;max-width:92vw;text-align:center}'+
'#fix81e button{margin:6px 4px 0;padding:6px 12px;border-radius:9px;border:0;background:#ffd84a;color:#2a1a00;font-weight:800}';
document.head.appendChild(st)}

// ===================================================================== N8: กันจอว่าง/เครื่องเก่า
// roundRect ไม่มีใน Chrome < 99 / Safari < 16 → ฟาร์ม (fix78) วาดพังทุกเฟรม
try{const pr=CanvasRenderingContext2D.prototype;if(!pr.roundRect)pr.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(+(Array.isArray(r)?r[0]:r)||0,Math.abs(w)/2,Math.abs(h)/2));
 this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.quadraticCurveTo(x+w,y,x+w,y+r);this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);this.closePath();return this}}catch(e){}
// ปุ่มซ่อมเกม: ล้างแคช/service worker (ไม่ลบเซฟ) แล้วโหลดใหม่
W81.repair81=function(){try{const done=()=>{try{location.reload()}catch(e){}};const jobs=[];
 if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations)jobs.push(navigator.serviceWorker.getRegistrations().then(rs=>Promise.all(rs.map(r=>r.unregister()))));
 if(W81.caches&&caches.keys)jobs.push(caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))));
 Promise.all(jobs).then(done,done);setTimeout(done,2500)}catch(e){location.reload()}};
const E81={shown:0,list:[]};
function errBox81(msg){if(E81.shown)return;E81.shown=1;let b=document.getElementById('fix81e');if(!b){b=document.createElement('div');b.id='fix81e';document.body.appendChild(b)}
 b.innerHTML='⚠️ เปิดเกมไม่สำเร็จบนเครื่องนี้<br><small style="opacity:.8">'+esc81(String(msg).slice(0,120))+'</small><br><button onclick="repair81()">🧹 ซ่อมเกม (ล้างแคช) แล้วโหลดใหม่</button><button onclick="this.parentNode.remove()">ปิด</button>'}
W81.addEventListener('error',e=>{try{E81.list.push(String(e.message||e));if(E81.list.length>20)E81.list.shift();
 if(typeof titleEl!=='undefined'&&!titleEl.hidden&&W81.__play81&&Date.now()-W81.__play81<15000)errBox81(e.message||'script error')}catch(_){}});
W81.addEventListener('unhandledrejection',e=>{try{if(typeof titleEl!=='undefined'&&!titleEl.hidden&&W81.__play81&&Date.now()-W81.__play81<15000)errBox81((e.reason&&e.reason.message)||e.reason||'promise')}catch(_){}});
if(typeof tPlay==='function'){const _tp=tPlay;tPlay=function(){W81.__play81=Date.now();let r;try{r=_tp.apply(this,arguments)}catch(e){errBox81(e.message||e);throw e}
  if(r&&r.catch)r.catch(e=>errBox81((e&&e.message)||e));
  // ยังค้างหน้าแรกนานเกินไป (ไม่มีอะไรเด้งขึ้นมา) → เสนอปุ่มซ่อม
  setTimeout(()=>{try{const pan=document.getElementById('tpan');const busy=pan&&/กำลัง|โหลด/.test(pan.textContent||'');if(!titleEl.hidden&&!busy&&W81.__play81&&!document.querySelector('#cc41go'))errBox81(E81.list.length?E81.list[E81.list.length-1]:'กดเข้าเกมแล้วไม่ตอบสนอง')}catch(e){}},12000);return r};W81.tPlay=tPlay}
// ลิงก์ "ซ่อมเกม" เล็ก ๆ ที่หน้าแรกเสมอ
setInterval(()=>{try{if(typeof titleEl==='undefined'||titleEl.hidden)return;const pan=document.getElementById('tpan');if(!pan||pan.querySelector('.rp81'))return;
 pan.insertAdjacentHTML('beforeend','<div class="rp81" style="margin-top:8px;font-size:11px;opacity:.7">เปิดเกมไม่ขึ้น/ค้าง? <a href="#" onclick="repair81();return false" style="color:#ffd84a">🧹 ซ่อมเกม</a></div>')}catch(e){}},1500);

// ===================================================================== N4: ล็อกขนาดจอ (ทุกเครื่องเห็นโลกขนาดเดียวกัน · ห้ามซูม)
if(typeof fitView==='function'){fitView=function(){const w=innerWidth||640,h=innerHeight||448;
  if(w>=h){VH=448;VW=Math.round(Math.min(VH*2.4,Math.max(VH*1.2,VH*w/h)))}else{VW=360;VH=Math.round(Math.min(VW*2.4,Math.max(VW*1.2,VW*h/w)))}};W81.fitView=fitView;try{applyRes()}catch(e){}}
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>{e.preventDefault()},{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
document.addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&/^(=|\+|-|_|0)$/.test(e.key))e.preventDefault()},{passive:false});
{let lt=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lt<300&&!(e.target&&e.target.closest&&e.target.closest('input,textarea,select')))e.preventDefault();lt=n},{passive:false})}

// ===================================================================== N1: 📬 กล่องจดหมาย
const MB81={list:[],t:0,busy:0};W81.MB81=MB81;
const mbW81=mk6('mb81');mbW81.classList.add('mb81');W81.mbW81=mbW81;
function mailDesc81(m){try{
 if(m.k==='auc'){const it=m.item||{};return {ic:prevIcon81(it,44),t:'🔨 ชนะประมูล: '+(m.nm||itName81(it)),s:'จ่ายไป 🪙 '+fmt81(m.paid)}}
 if(m.k==='coin')return {ic:'🪙',t:'🪙 '+fmt81(m.n)+' เหรียญ',s:m.why||'เงินคืน'};
 if(m.k==='wbwin')return {ic:'🐉',t:'🐉 รางวัลบอสโลก อันดับ '+(m.rank|0)+'/'+(m.n|0),s:fmt81(m.d)+' ดาเมจ'+(m.gem?' · 💠 +'+m.gem+' (เข้าบัญชีแล้ว)':'')};
 return {ic:'📦',t:'📦 ของจากระบบ',s:m.why||''}}catch(e){return {ic:'📦',t:'📦 จดหมาย',s:''}}}
function openMail81(){p6open(mbW81);renderMail81();if(typeof ON10!=='undefined'&&ON10.auth)send81({t:'mlist'})}W81.openMail81=openMail81;
function renderMail81(){const L=MB81.list||[],auth=!!(typeof ON10!=='undefined'&&ON10.auth);
 let h='<div class="w" style="width:min(460px,96%);height:auto;max-height:92%"><div class="hd"><b>📬 กล่องจดหมาย'+(L.length?' ('+L.length+')':'')+'</b><button onclick="p6close(mbW81)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:9px">';
 h+='<div class="top"><small>ของจาก 🔨 โรงประมูล · 🐉 บอสโลก · 🪙 เงินคืน จะรออยู่ที่นี่จนกว่าจะกดรับ (ไม่หายแม้หลุดเกม)</small>'+(L.length>1?'<button class="mini" onclick="claim81(\'all\')">📥 รับทั้งหมด</button>':'')+'</div>';
 if(!ok81()||!auth)h+='<div class="em">⚠️ ต้องเชื่อมต่อออนไลน์และเข้าสู่ระบบบัญชีก่อน จึงจะเปิดกล่องจดหมายได้</div>';
 else if(!L.length)h+='<div class="em">📭 ยังไม่มีจดหมาย<br><small>ชนะประมูล/ปราบบอสโลกแล้ว ของจะถูกส่งมาที่นี่</small></div>';
 else for(const m of L.slice().reverse()){const d=mailDesc81(m),dt=new Date(m.ts||Date.now());
  h+='<div class="it"><div class="ic">'+(typeof d.ic==='string'&&d.ic.length<4?d.ic:'<span data-mi="'+esc81(m.id)+'"></span>')+'</div><div class="tx"><b>'+esc81(d.t)+'</b><small>'+esc81(d.s)+' · '+dt.toLocaleDateString('th-TH')+' '+dt.toTimeString().slice(0,5)+'</small></div><button class="mini" '+(MB81.busy?'disabled':'')+' onclick="claim81(\''+esc81(m.id)+'\')">รับ</button></div>'}
 mbW81.innerHTML=h+'</div></div>';
 for(const m of L){const sp=mbW81.querySelector('[data-mi="'+m.id+'"]');if(!sp)continue;const d=mailDesc81(m);if(d.ic&&d.ic.nodeType)sp.replaceWith(d.ic);else sp.textContent='📦'}}
W81.claim81=function(id){if(MB81.busy)return;if(!ok81()){say('📬 ต้องเชื่อมต่อออนไลน์ก่อน');return}MB81.busy=1;setTimeout(()=>{MB81.busy=0;if(!mbW81.hidden)renderMail81()},2500);
 send81(id==='all'?{t:'mclaim',all:1}:{t:'mclaim',ids:[id]});if(!mbW81.hidden)renderMail81()};
function mbBadge81(){try{const n=(MB81.list||[]).length,ix=PM7.findIndex(m=>m[3]==='mb81');if(ix<0)return;PM7[ix][1]='จดหมาย';const b=pm7.querySelector('button[data-i="'+ix+'"]');if(!b)return;
 let i=b.querySelector('.bd81');if(!n){if(i)i.remove();return}if(!i){i=document.createElement('i');i.className='bd81';i.style.cssText='position:absolute;right:3px;top:2px;font:900 9px system-ui;font-style:normal;background:#e04a3a;border-radius:7px;padding:0 4px;color:#fff';b.appendChild(i)}i.textContent=n}catch(e){}}
try{const at=PM7.findIndex(m=>m[1]==='สถานะ');PM7.splice(at<0?0:at+1,0,['📬','จดหมาย',()=>openMail81(),'mb81']);
 const _pr=pmRender7;pmRender7=function(){const r=_pr.apply(this,arguments);mbBadge81();return r};W81.pmRender7=pmRender7;pmRender7()}catch(e){}
// ปุ่มลอยเล็ก ๆ บอกว่ามีจดหมาย (แตะเพื่อเปิด)
const mbF81=document.createElement('button');mbF81.className='mini';mbF81.style.cssText='position:absolute;left:8px;top:calc(150px + var(--st,0px));z-index:6;display:none;animation:none';mbF81.onclick=()=>openMail81();
mbF81.addEventListener('pointerdown',e=>e.stopPropagation());gid('wrap').appendChild(mbF81);
setInterval(()=>{const n=(MB81.list||[]).length;mbF81.style.display=n&&titleEl.hidden&&!(typeof inTower10==='function'&&inTower10())?'block':'none';mbF81.textContent='📬 '+n;mbBadge81()},1000);
// รับข้อความ
{const _nm=netMsg;netMsg=function(d){const r=_nm(d);try{
  if(d.t==='mbox'){const was=(MB81.list||[]).length;MB81.list=Array.isArray(d.list)?d.list:[];if(!mbW81.hidden)renderMail81();mbBadge81();
   if(d.fresh||(MB81.list.length>was&&was===0&&MB81.list.length)){try{sfx('chest');banner('📬 มีจดหมายใหม่',(MB81.list.length)+' ฉบับ · เปิดเมนู 📬 จดหมาย เพื่อรับของ')}catch(e){}try{sysSay('📬 มีของรอรับในกล่องจดหมาย '+MB81.list.length+' ชิ้น (เมนูตัวละคร → 📬 จดหมาย)')}catch(e){}}}
  else if(d.t==='mgot'){MB81.busy=0;if(d.list&&d.list.length){mail10(d.list)}if(!mbW81.hidden)renderMail81()}
  else if(d.t==='gmtop'){try{sfx('gem');banner('💝 มีคำขอโดเนทรออนุมัติ',(d.n|0)+' รายการ'+(d.who?' · ล่าสุด: '+d.who+' '+(d.baht|0)+' บาท':''));sysSay('💝 [GM] คำขอโดเนทรออนุมัติ '+(d.n|0)+' รายการ — เปิด 💠 เหรียญแฟชั่น → แท็บ GM แล้วกดอนุมัติหลังตรวจสลิป')}catch(e){}}
 }catch(e){console.warn('[mb81]',e)}return r};W81.netMsg=netMsg}

// ===================================================================== N7: โรงประมูลเห็นของจริง
const LOOT81={'🐉 มังกรเวหาอเวจี (สัตว์ขี่บิน)':{k:'mount',id:'drake'},'🪽 เพกาซัสสายฟ้า (สัตว์ขี่บิน)':{k:'mount',id:'pegasus'},'⚔️ ดาบเพชร +12':{k:'gear',id:'sword5',e:12},'🏹 ธนูเพชร +12':{k:'gear',id:'bow5',e:12},
 '🔮 คทาเพชร +12':{k:'gear',id:'staff5',e:12},'🛡️ เสื้อเกราะเพชร +10':{k:'gear',id:'chest5',e:10},'⛑️ หมวกเพชร +10':{k:'gear',id:'helm5',e:10},'💍 แหวนเพชร +10':{k:'gear',id:'ring5',e:10},
 '🗡️ อาวุธแฟชั่น มังกร':{k:'fash',id:'w:dragon'},'⚡ อาวุธแฟชั่น สายฟ้า':{k:'fash',id:'w:thunder'},'✨ หินพร ×15':{k:'mat',id:'bless',n:15},'💠 หินตีบวก ×80':{k:'mat',id:'estone',n:80},'💎 อัญมณี ×25':{k:'mat',id:'gem',n:25}};
function itName81(it){try{if(it.k==='gear')return ((ITEMS[it.id]&&ITEMS[it.id].name)||it.id)+(it.e?' +'+it.e:'');if(it.k==='mount')return (MOUNTS[it.id]&&MOUNTS[it.id].n)||it.id;
 if(it.k==='fash'){const k=String(it.id).slice(2);const D6=it.id[0]==='w'?FWPN[k]:OUTFIT[k];return (D6&&D6.n)||it.id}return ((INVMETA[it.id]&&INVMETA[it.id][0])||it.id)+(it.n?' ×'+it.n:'')}catch(e){return String(it.id)}}
function mountPrev81(id,S){const c=document.createElement('canvas');c.width=S*1.6;c.height=S*1.25;const k=c.getContext('2d'),sv=ctx;
 try{ctx=k;k.translate(c.width/2,c.height*.78);k.scale(S/66,S/66);drawSteed(id,0,0,1,false)}catch(e){}finally{ctx=sv}return c}
function prevIcon81(it,S){try{if(!it||!it.k)return '📦';
 if(it.k==='gear'&&ITEMS[it.id]){const im=new Image();im.src=iconURL('item:'+it.id);im.style.width=im.style.height=Math.round(S*.75)+'px';return im}
 if(it.k==='mat'){const im=new Image();im.src=iconURL('mat:'+it.id);im.style.width=im.style.height=Math.round(S*.75)+'px';return im}
 if(it.k==='mount'&&typeof drawSteed==='function')return mountPrev81(it.id,S);
 if(it.k==='fash'&&typeof fashPreview==='function'){const k=String(it.id).slice(2);const c=fashPreview(it.id[0]==='w'?'wpn':'body',k);c.style.width=Math.round(S*1.2)+'px';return c}}catch(e){}return '📦'}
function itStat81(it){try{if(it.k==='gear'&&ITEMS[it.id]){const I=ITEMS[it.id];return (I.stat||'')+(it.e?' · ตีบวก +'+it.e:'')}if(it.k==='mount')return 'สัตว์ขี่ถาวร · ขี่บินข้ามสิ่งกีดขวาง · กด 🐎 เพื่อขี่';
 if(it.k==='fash')return 'อาวุธแฟชั่น (เปลี่ยนรูปลักษณ์อาวุธ) · ใส่ได้ทุกอาชีพ';if(it.k==='mat')return ((INVMETA[it.id]&&INVMETA[it.id][1])||'วัตถุดิบหายาก')}catch(e){}return ''}
W81.aucView81=function(id){const l=(AUC10.lots||[]).find(x=>x.id===id);if(!l)return;const it=l.it||LOOT81[l.nm]||{};const c=prevIcon81(it,150);
 const box=document.createElement('div');box.style.cssText='position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center';
 box.innerHTML='<div style="background:#221d2c;border:2px solid #D4AF37;border-radius:14px;padding:14px;max-width:90vw;width:330px;text-align:center;color:#fff;font:600 13px system-ui,\'Noto Sans Thai\',sans-serif"><div class="pv81" style="height:170px;display:flex;align-items:center;justify-content:center;background:radial-gradient(#5a4a7a,#16101f);border-radius:12px"></div><b style="display:block;font-size:16px;margin:8px 0 4px">'+esc81(l.nm)+'</b><div style="color:#bfe3ff;font-size:12px">'+esc81(itStat81(it))+'</div><button class="mini" style="margin-top:10px">ปิด</button></div>';
 const pv=box.querySelector('.pv81');if(c&&c.nodeType){if(c.tagName==='IMG'){c.style.width=c.style.height='110px';c.style.imageRendering='pixelated'}pv.appendChild(c)}else pv.textContent=c;
 box.addEventListener('pointerdown',e=>{e.stopPropagation();if(e.target===box||e.target.tagName==='BUTTON')box.remove()});document.body.appendChild(box)};
if(typeof aucRender10==='function'){aucRender10=function(){const L=AUC10.lots||[],now=Date.now();
  let h='<div class="w" style="width:min(480px,96%);height:auto;max-height:92%"><div class="hd"><b>🔨 โรงประมูลของหายาก</b><button onclick="p6close(aucW10)">✕</button></div><div class="bd" style="flex-direction:column;overflow-y:auto;padding:8px;gap:7px">';
  h+='<small style="opacity:.8">ของหายากจากบอสโลก · แตะรูปเพื่อดูของ · ให้ราคาสูงกว่าเดิม 5% ขึ้นไป · ชนะแล้ว/ถูกแซง ของและเงินคืนเข้า 📬 กล่องจดหมาย · เหรียญของคุณ 🪙 '+fmt81(inv.coin)+(ON10.auth?'':'<br>⚠️ ต้องเข้าสู่ระบบบัญชีออนไลน์จึงจะประมูลได้')+'</small>';
  if(!L.length)h+='<div style="padding:18px;text-align:center;opacity:.7">ยังไม่มีของประมูล — ปราบบอสโลก (12:00 / 20:00) เพื่อให้ของหายากดรอปเข้าโรงประมูล</div>';
  for(const l of L){const left=Math.max(0,(l.end-now)/1000),need=l.bids?Math.ceil(l.cur*1.05):l.cur,it=l.it||LOOT81[l.nm]||{};
   h+='<div class="au81"><div class="pv" data-ap="'+l.id+'" onclick="aucView81('+l.id+')"></div><div class="bd2"><b>'+esc81(l.nm)+'</b><div class="st">'+esc81(itStat81(it))+'</div><small>ราคาปัจจุบัน 🪙 '+fmt81(l.cur)+(l.by?' · โดย '+esc81(l.by):' · ยังไม่มีคนประมูล')+' · ⌛ '+Math.floor(left/3600)+' ชม. '+Math.floor(left%3600/60)+' นาที</small>'+
    '<div style="display:flex;gap:6px;margin-top:5px"><input id="ab10_'+l.id+'" type="number" min="'+need+'" value="'+need+'" style="flex:1;min-width:0;padding:4px;border-radius:6px;border:1px solid #888;background:#111;color:#fff"><button class="mini" onclick="aucBid10('+l.id+')">ให้ราคา</button></div></div></div>'}
  const keep={};try{for(const l of L){const e=gid('ab10_'+l.id);if(e&&document.activeElement===e)keep[l.id]=e.value}}catch(e){}
  aucW10.innerHTML=h+'</div></div>';
  for(const l of L){const pv=aucW10.querySelector('[data-ap="'+l.id+'"]');if(!pv)continue;const c=prevIcon81(l.it||LOOT81[l.nm]||{},72);if(c&&c.nodeType)pv.appendChild(c);else pv.textContent=c;if(keep[l.id]!=null){const e=gid('ab10_'+l.id);if(e){e.value=keep[l.id];e.focus()}}}};W81.aucRender10=aucRender10}

// ===================================================================== N2: ออกโหมดไหน ออกที่ประตูโหมดนั้น
const RET81={};W81.RET81=RET81;
function rec81(key){try{if(D&&(D.zone||D.shop||D.dg))return;RET81[key]={town:!!(D&&D.town),x:P.x,y:P.y,t:Date.now()}}catch(e){}}
function back81(key,title,orig){const R=RET81[key];if(!R||Date.now()-R.t>6*3600e3)return orig();delete RET81[key];
 LoadingScreenManager.cover({icon:'🚪',title},()=>{try{exitD()}catch(e){}if(R.town){try{enterTown(1)}catch(e){}}
  P.x=R.x;P.y=R.y+(R.town?18:10);P.dir='d';P.kx=P.ky=0;try{unstick()}catch(e){}try{say(R.town?'ออกมาที่หน้าประตูแล้ว':'กลับมาที่หน้าประตูมิติแล้ว')}catch(e){}})}
for(const [en,lv,key,tt] of [['enterTower10','leaveTower10','tw','ออกจากหอคอย'],['enterWb10','leaveWb10','wb','ออกจากลานบอสโลก'],['enter62','leave62','lb','ออกจากลานผนึก'],['enterArena8','leaveArena8','ar','ออกจากสนามประลอง']]){
 try{if(typeof W81[en]!=='function'||typeof W81[lv]!=='function')continue;const _e=W81[en],_l=W81[lv];
  const ne=function(){rec81(key);return _e.apply(this,arguments)};const nl=function(){const a=arguments,me=this;
   const inIt=key==='tw'?inTower10():key==='wb'?inWb10():key==='lb'?in62():inArena8();if(!inIt)return _l.apply(me,a);if(key==='lb'){try{AOE62.length=0}catch(e){}}return back81(key,tt,()=>_l.apply(me,a))};
  W81[en]=ne;W81[lv]=nl;
  // อัปเดตชื่อในขอบเขตสคริปต์ (ฟังก์ชันที่ประกาศแบบ function ใช้ชื่อ global เดียวกัน)
  if(en==='enterTower10')enterTower10=ne;if(lv==='leaveTower10')leaveTower10=nl;if(en==='enterWb10')enterWb10=ne;if(lv==='leaveWb10')leaveWb10=nl;
  if(en==='enter62')enter62=ne;if(lv==='leave62')leave62=nl;if(en==='enterArena8')enterArena8=ne;if(lv==='leaveArena8')leaveArena8=nl}catch(e){console.warn('[ret81]',en,e)}}

// ===================================================================== N3a: ที่ดินผู้กล้า — เดินไปทางขวาจากเมือง → โผล่ฝั่งซ้ายของที่ดิน · เดินออกซ้าย → กลับขอบขวาของเมือง
const HG81={y0:19,y1:20};
function homeGate81(){try{const Zm=ZCACHE[300];if(!Zm||Zm.g81===Zm.cv)return;Zm.g81=Zm.cv;const m=Zm.m,k=Zm.cv.getContext('2d'),ex=Math.max(4,Math.min(Zm.W-4,Math.floor(Zm.ent.x)));
  for(let y=HG81.y0;y<=HG81.y1;y++)for(let x=0;x<ex;x++){if(x<4||m[y][x]===WL)m[y][x]=FL;const px=x*T,py=y*T,h=hash(x*3.1,y*1.7);
   k.fillStyle=h>.5?'#cfb48a':'#c4a87c';k.fillRect(px,py,T,T);k.fillStyle='rgba(120,90,60,.35)';for(let i=0;i<3;i++){const q=hash(x*7+i,y*5-i);k.beginPath();k.ellipse(px+5+q*22,py+6+((q*37)%1)*20,3+q*2,2+q,0,0,7);k.fill()}
   if(y===HG81.y0){k.fillStyle='rgba(0,0,0,.12)';k.fillRect(px,py,T,2)}if(y===HG81.y1){k.fillStyle='rgba(0,0,0,.12)';k.fillRect(px,py+T-2,T,2)}}
  // ป้าย ← เมือง
  const sx=1.2*T,sy=(HG81.y0-1)*T+4;k.fillStyle='#6a4426';k.fillRect(sx+30,sy+8,4,26);k.fillStyle='#8a5a2e';k.fillRect(sx,sy,64,18);k.strokeStyle='#3a2410';k.strokeRect(sx+.5,sy+.5,63,17);
  k.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';k.textAlign='center';k.fillStyle='#ffe9b0';k.fillText('⬅ เมืองเอลโดเรีย',sx+32,sy+13);
  try{mkMini(Zm.cv,Zm.W,Zm.H,3)}catch(e){}}catch(e){console.warn('[home81]',e)}}
if(typeof enterHome==='function'){const _eh=enterHome;enterHome=function(){const fromTown=!!(D&&D.town);const r=_eh.apply(this,arguments);
  try{if(D&&D.home){homeGate81();if(fromTown){P.x=2.2*T;P.y=(HG81.y0+.9)*T;P.dir='r';P.kx=P.ky=0;D.g81t=performance.now()}}}catch(e){}return r};W81.enterHome=enterHome}
setInterval(()=>{try{if(!(D&&D.home)||PAUSED)return;homeGate81();if(D.g81t&&performance.now()-D.g81t<1200)return;
 if(P.x<.9*T&&P.y>HG81.y0*T-4&&P.y<(HG81.y1+1)*T+4){D.g81t=performance.now();
  LoadingScreenManager.cover({icon:'🏰',title:'กลับเมืองเอลโดเรีย'},()=>{try{exitD()}catch(e){}try{enterTown(1)}catch(e){}P.x=(TW-3.8)*T;P.y=16.6*T;P.dir='l';P.kx=P.ky=0;try{unstick()}catch(e){}})}}catch(e){}},120);

// ===================================================================== N3b: ตลาด — เดินลงจากประตูใต้ → โผล่ด้านบนของตลาด · เดินขึ้นกลับทางเดิม (ไม่มีปุ่ม "กลับเมือง")
function mkGate81(Zm){try{if(!Zm||Zm.g81)return;Zm.g81=1;const m=Zm.m,k=Zm.cv.getContext('2d'),W=Zm.W,cx=W/2;
  for(let y=0;y<2;y++)for(let x=cx-4;x<=cx+3;x++){const px=x*T,py=y*T;k.fillStyle='#6a4a32';k.fillRect(px,py,T,T);k.fillStyle='#8a6444';k.fillRect(px+1,py+1,T-2,T-10);k.fillStyle='#b8865a';k.fillRect(px+1,py+1,T-2,4)}
  for(let y=0;y<2;y++)for(let x=cx-1;x<=cx;x++){m[y][x]=FL;const px=x*T,py=y*T,h=hash(x*1.3,y*2.7);k.fillStyle=h>.5?'#c8b08a':'#bfa680';k.fillRect(px,py,T,T);k.strokeStyle='rgba(90,70,50,.25)';k.strokeRect(px+.5,py+.5,T/2,T/2);k.strokeRect(px+T/2+.5,py+T/2+.5,T/2-1,T/2-1)}
  // เสาประตู + ป้าย 2 ข้าง
  for(const gx of [(cx-1)*T-8,(cx+1)*T]){k.fillStyle='#5a3a22';k.fillRect(gx,0,8,2*T);k.fillStyle='#ffd84a';k.fillRect(gx,0,8,4)}
  const sg=(x,t)=>{k.fillStyle='#4a2a1a';k.fillRect(x,6,118,30);k.strokeStyle='#ffd84a';k.lineWidth=2;k.strokeRect(x,6,118,30);k.font='900 13px Georgia,serif';k.textAlign='center';k.fillStyle='#ffd84a';k.fillText(t,x+59,26)};
  sg((cx-1)*T-132,'🏪 ตลาดกลาง');sg((cx+1)*T+14,'⬆ ทางกลับเมือง');try{mkMini(Zm.cv,Zm.W,Zm.H,4)}catch(e){}}catch(e){console.warn('[mk81]',e)}}
const MK81={place:0,t:0};
if(typeof enterMk10==='function'){const _em=enterMk10;enterMk10=function(){try{mkGate81(buildMk10())}catch(e){}MK81.place=performance.now();window.__mk76=1;return _em.apply(this,arguments)};W81.enterMk10=enterMk10}
try{const b=mkBar10.querySelectorAll('button');for(const x of b)if(/กลับเมือง/.test(x.textContent))x.remove()}catch(e){}
setInterval(()=>{try{if(!inMk10()){return}const Zm=D.zone;mkGate81(Zm);
 if(MK81.place){if(performance.now()-MK81.place<8000){P.x=(Zm.W/2)*T;P.y=2.9*T;P.dir='d';P.kx=P.ky=0}MK81.place=0;MK81.t=performance.now();return}
 if(performance.now()-MK81.t<1500||PAUSED)return;if(P.y<1.25*T&&Math.abs(P.x-(Zm.W/2)*T)<T+4){MK81.t=performance.now();leaveMk10()}}catch(e){}},100);
// ป้ายบอกทางเหนือหัวตอนอยู่ใกล้ประตูตลาด
{const _h=hero;hero=function(){const r=_h.apply(this,arguments);try{if(!window.__IN_OTHER8&&ctx.canvas.isConnected&&inMk10()&&P.y<5*T){const Zm=D.zone;ctx.save();ctx.font='bold 11px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';
  const s='⬆ เดินขึ้นเพื่อกลับเมือง';ctx.strokeText(s,(Zm.W/2)*T,4.4*T);ctx.fillStyle='#ffe9a0';ctx.fillText(s,(Zm.W/2)*T,4.4*T);ctx.restore()}}catch(e){}return r};W81.hero=hero}

// ===================================================================== N5: สกิลลากเล็งแบบ RoV (จอสัมผัส) — แตะ = เล็งอัตโนมัติเหมือนเดิม · ลาก = เลือกทิศ/จุดตก
const AIM81={on:0,dx:0,dy:0,f:0,cast:null};W81.AIM81=AIM81;
const AREA81={arrowrain:180,meteor:225};// ระยะไกลสุดที่ลากวางได้ (เดิม 120/150 = ×1.5 · สมดุล)
{const pp=PERS.push;PERS.push=function(){try{const c=AIM81.cast;if(c&&performance.now()<c.until)for(const o of arguments){if(o&&o.x!=null&&o.y!=null&&AREA81[o.k]){const R=AREA81[o.k],d=Math.max(40,Math.min(R,c.f*R));o.x=P.x+c.dx*d;o.y=P.y+c.dy*d}}}catch(e){}return pp.apply(this,arguments)}}
function aimWrap81(b,s){if(!b||!b.onpointerdown||b.onpointerdown===b.my81)return;b.h081=b.onpointerdown;
 const my=function(e){if(e.pointerType==='mouse')return b.h081.call(this,e);e.preventDefault();
  b.st81={id:e.pointerId,x0:e.clientX,y0:e.clientY,aim:0,ev:e};try{b.setPointerCapture(e.pointerId)}catch(_){}};
 b.my81=my;b.onpointerdown=my;if(b.a81)return;b.a81=1;
 b.addEventListener('pointermove',e=>{const st=b.st81;if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x0,dy=e.clientY-st.y0,L=Math.hypot(dx,dy);
  if(L>16){st.aim=1;st.cancel=0;AIM81.on=1;AIM81.dx=dx/L;AIM81.dy=dy/L;AIM81.f=Math.min(1,(L-16)/80);AIM81.s=s}else if(st.aim){AIM81.on=0;st.cancel=1}});
 const end=e=>{const S=b.st81;if(!S||e.pointerId!==S.id)return;b.st81=null;AIM81.on=0;try{b.releasePointerCapture(e.pointerId)}catch(_){}
  if(e.type==='pointercancel')return;const h0=b.h081;
  if(S.aim&&!S.cancel){const now=performance.now(),R=60+AIM81.f*240,svx=MS9.x,svy=MS9.y,svt=MS9.t;
   MS9.x=P.x+AIM81.dx*R;MS9.y=(P.y-14)+AIM81.dy*R;MS9.t=now;AIM81.cast={dx:AIM81.dx,dy:AIM81.dy,f:Math.max(.15,AIM81.f),until:now+80};
   try{const v=AIM81.dx,w=AIM81.dy;P.dir=Math.abs(v)>Math.abs(w)?(v<0?'l':'r'):(w<0?'u':'d');h0.call(b,S.ev)}finally{MS9.x=svx;MS9.y=svy;MS9.t=svt;setTimeout(()=>{AIM81.cast=null},90)}}
  else if(S.cancel){try{say('ยกเลิกการร่าย')}catch(_){}}
  else h0.call(b,S.ev)};
 b.addEventListener('pointerup',end);b.addEventListener('pointercancel',end)}
function aimHook81(){try{SBTN.forEach((b,s)=>aimWrap81(b,s));aimWrap81(sk6,4);aimWrap81(sk7,5)}catch(e){}}
setTimeout(aimHook81,800);setInterval(aimHook81,4000);
// วาดเส้นเล็ง/วงตกขณะลาก
{const _h=hero;hero=function(){const r=_h.apply(this,arguments);try{if(AIM81.on&&!window.__IN_OTHER8&&ctx.canvas.isConnected){const R=60+AIM81.f*240,x=P.x,y=P.y-14,ex=x+AIM81.dx*R,ey=y+AIM81.dy*R,t=performance.now()/1000;
  ctx.save();ctx.strokeStyle='rgba(120,220,255,.85)';ctx.lineWidth=3;ctx.setLineDash([10,7]);ctx.lineDashOffset=-t*40;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(120,220,255,.16)';ctx.beginPath();ctx.ellipse(ex,ey+8,58,30,0,0,7);ctx.fill();ctx.strokeStyle='rgba(160,235,255,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(ex,ey+8,58,30,0,0,7);ctx.stroke();
  ctx.fillStyle='#bff0ff';ctx.beginPath();ctx.arc(ex,ey,4,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y+14,300,0,7);ctx.stroke();ctx.restore()}}catch(e){}return r};W81.hero=hero}

// ===================================================================== N9: ชาวเมืองมีชีวิต — กลางคืนกลับเข้าบ้าน (หายจากถนน) · กลางวันเดินเที่ยว/เข้าร้าน · บ้านว่าง 2 หลังให้ครอบครัวอยู่
const HOMES81={A:{n:'บ้านครอบครัวบุญมี',x:5.5,y:7.6,who:['ชาวนา','ชาวบ้าน','คุณยาย','เด็กน้อย','แม่ค้าผัก','ลุงขายผัก']},
 B:{n:'บ้านครอบครัวบรูโน่',x:11.5,y:8.6,who:['พ่อค้า','หญิงสาว','เด็กหญิง','คุณตา','แม่ค้าผลไม้','คนขายขนมปัง']},
 inn:{n:'โรงเตี๊ยม',door:'inn',who:['นักดื่ม','นักเดินทาง']},gear:{n:'ร้านอาวุธ',door:'gear',who:['ช่างตีเหล็ก']}};
W81.HOMES81=HOMES81;
const STALL81=new Set(['แม่ค้าผัก','แม่ค้าผลไม้','คนขายขนมปัง','ลุงขายผัก']);
const SPOTS81=[[19.5,13.5],[25.5,13.5],[22.5,15.6],[16.5,21.5],[28.5,21.5],[22.5,24.5],[17.5,30.6],[26.5,30.6],[8.5,16.6],[36.5,16.6]];
const LIFE81={grid:null,cv:null,off:-99999};W81.LIFE81=LIFE81;
function grid81(){if(LIFE81.cv===dcv&&LIFE81.grid)return LIFE81.grid;const G=[];for(let y=0;y<TH;y++){G[y]=[];for(let x=0;x<TW;x++){let ok=dm[y]&&dm[y][x]===0;if(ok)try{ok=!staticHit(x*T+16,y*T+18)}catch(e){}G[y][x]=ok?1:0}}LIFE81.grid=G;LIFE81.cv=dcv;return G}
function near81(x,y){const G=grid81();let tx=Math.floor(x/T),ty=Math.floor(y/T);if(G[ty]&&G[ty][tx])return [tx,ty];for(let r=1;r<6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const a=tx+dx,b=ty+dy;if(G[b]&&G[b][a])return [a,b]}return [tx,ty]}
function path81(x0,y0,x1,y1){const G=grid81(),[sx,sy]=near81(x0,y0),[ex,ey]=near81(x1,y1),key=(x,y)=>y*TW+x,prev=new Map([[key(sx,sy),-1]]),q=[[sx,sy]];let qi=0,found=false;
 while(qi<q.length){const [x,y]=q[qi++];if(x===ex&&y===ey){found=true;break}for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy;if(!G[b]||!G[b][a]||prev.has(key(a,b)))continue;prev.set(key(a,b),key(x,y));q.push([a,b])}if(q.length>2500)break}
 if(!found)return null;const out=[];let k=key(ex,ey);while(k!==-1){out.push([(k%TW)*T+16,Math.floor(k/TW)*T+18]);k=prev.get(k)}out.reverse();
 // ตัดจุดตรงกลางแนวเส้นตรง
 const s=[];for(let i=0;i<out.length;i++){if(i>0&&i<out.length-1){const a=out[i-1],b=out[i],c=out[i+1];if((a[0]===b[0]&&b[0]===c[0])||(a[1]===b[1]&&b[1]===c[1]))continue}s.push(out[i])}s.push([x1,y1]);return s}
function homeOf81(n){for(const k in HOMES81)if(HOMES81[k].who.indexOf(n.name)>=0)return k;return 'B'}
function doorPt81(k){const H=HOMES81[k];if(H.door){const d=(D.doors||[]).find(q=>q.id===H.door);if(d)return [d.cx,d.cy+22]}return [(H.x||5.5)*T,(H.y||8)*T]}
function shopDoors81(){return (D.doors||[]).filter(d=>['gear','potion','skill','store','guild','fashion','bank','inn'].indexOf(d.id)>=0).map(d=>[d.cx,d.cy+22,d.id])}
function hide81(n,where){const L=n.l81;L.hid=where;L.hx=n.x;L.hy=n.y;n.vis=false;n.bub=null;n.mv=false}
function show81(n,x,y){const L=n.l81;L.hid=null;L.x=x;L.y=y;n.x=x;n.y=y;delete n.vis}
function go81(n,tx,ty,then){const L=n.l81,p=path81(L.x,L.y,tx,ty);if(!p){L.x=tx;L.y=ty;L.path=null;if(then)then();return}L.path=p;L.then=then}
function init81(n){if(n.l81)return;const post=n.home?{x:n.home.x,y:n.home.y}:{x:n.x,y:n.y};
 n.l81={post,x:post.x,y:post.y,path:null,then:null,hid:null,wait:15+Math.random()*50,h:homeOf81(n),wake:0,dl:Math.random()*25,stall:STALL81.has(n.name)};
 if(night48()){const [x,y]=doorPt81(n.l81.h);n.l81.x=x;n.l81.y=y;hide81(n,'home')}}
function life81(n,dt){const L=n.l81,ng=night48(),talk=DLG&&DLG.open&&DLG.n===n;
 if(L.wake>0){L.wake-=dt;if(L.hid){show81(n,L.x,L.y)}}
 if(L.hid){n.x=LIFE81.off;n.y=LIFE81.off;n.vis=false;
  if(L.hid==='home'&&!ng){if((L.dl-=dt)<=0){const [x,y]=doorPt81(L.h);show81(n,x,y);L.dl=Math.random()*25;go81(n,L.post.x,L.post.y,null)}}
  else if(L.hid==='shop'){if((L.in-=dt)<=0){show81(n,L.hx,L.hy);go81(n,L.post.x,L.post.y,null)}}
  return}
 // กลางคืน: เดินกลับบ้าน แล้วหายเข้าไป
 if(ng&&!L.goHome&&!(L.wake>0)&&!talk){if((L.dl-=dt)<=0){L.goHome=1;L.dl=Math.random()*25;const [x,y]=doorPt81(L.h);go81(n,x,y,()=>{L.goHome=0;hide81(n,'home')})}}
 if(!ng)L.goHome=0;
 const dp=Math.hypot(P.x-n.x,P.y-n.y);
 if(talk||dp<64||L.wake>0){n.mv=false;n.x=L.x;n.y=L.y;if(dp<90){const dx=P.x-n.x,dy=P.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}return}
 if(L.path&&L.path.length){const [tx,ty]=L.path[0],dx=tx-L.x,dy=ty-L.y,d=Math.hypot(dx,dy),sp=(n.age==='child'?44:34)*dt;
  if(d<=sp){L.x=tx;L.y=ty;L.path.shift();if(!L.path.length){L.path=null;const f=L.then;L.then=null;if(f)f()}}else{L.x+=dx/d*sp;L.y+=dy/d*sp}
  n.mv=true;n.t=(n.t||0)+dt*8;if(d>.5)n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?'l':'r'):(dy<0?'u':'d')}
 else{n.mv=false;
  // กลางวัน: ยืนประจำจุดสักพัก แล้วเดินไปเที่ยว/เข้าร้าน แล้วกลับจุดเดิม (แม่ค้าแผงอยู่ประจำแผง)
  if(!ng&&!L.stall&&(L.wait-=dt)<=0){L.wait=30+Math.random()*60;const atPost=Math.hypot(L.x-L.post.x,L.y-L.post.y)<20;
   if(!atPost)go81(n,L.post.x,L.post.y,null);
   else if(Math.random()<.55){const ds=shopDoors81();if(ds.length){const d=ds[Math.random()*ds.length|0];go81(n,d[0],d[1],()=>{L.in=6+Math.random()*12;hide81(n,'shop')})}}
   else{const s=SPOTS81[Math.random()*SPOTS81.length|0];go81(n,s[0]*T,s[1]*T,()=>{L.wait=8+Math.random()*14})}}}
 n.x=L.x;n.y=L.y}
if(typeof updNPCs==='function'){const _u=updNPCs;updNPCs=function(dt){try{if(D&&D.town&&D.npcs)for(const n of D.npcs)if(n.l81){n.x=n.l81.x;n.y=n.l81.y}}catch(e){}const r=_u.apply(this,arguments);
  try{if(D&&D.town&&!D.shop&&D.npcs){const d=Math.min(.1,dt||.016);for(const n of D.npcs){if(n.ess48||n.hat==='crown')continue;if(!n.i48)continue;init81(n);n.slp=false;life81(n,d)}}}catch(e){console.warn('[life81]',e)}return r};W81.updNPCs=updNPCs}
// ซ่อนตอนวาด (กันกรณีวาดก่อนอัปเดต)
if(typeof drawNPC==='function'){const _d=drawNPC;drawNPC=function(n){if(n&&n.l81&&n.l81.hid)return;return _d.apply(this,arguments)};W81.drawNPC=drawNPC}
// คุยกับคนที่อยู่ในบ้าน/ในร้าน (เช่นจากเควส) → ออกมาหาเรา
if(typeof npcTalk==='function'){const _nt=npcTalk;npcTalk=function(n){try{if(n&&n.l81&&n.l81.hid){const L=n.l81;let x=P.x+(P.dir==='l'?-26:26),y=P.y;
   for(const k in HOMES81){const [hx,hy]=doorPt81(k);if(Math.hypot(P.x-hx,P.y-hy)<90&&k===L.h){x=hx;y=hy}}show81(n,x,y);L.path=null;L.goHome=0;L.wake=25}else if(n&&n.l81)n.l81.wake=Math.max(n.l81.wake,12)}catch(e){}return _nt.apply(this,arguments)};W81.npcTalk=npcTalk}
// เคาะประตูบ้าน (บ้านว่างเดิม 2 หลัง) → เรียกคนในบ้านออกมาคุย
if(typeof interact==='function'){const _it=interact;interact=function(){try{if(D&&D.town&&!D.shop&&!(DLG&&DLG.open)){for(const k of ['A','B']){const [hx,hy]=doorPt81(k);if(Math.hypot(P.x-hx,P.y-hy)>40)continue;
   if((D.npcs||[]).some(n=>!(n.l81&&n.l81.hid)&&Math.hypot(n.x-P.x,n.y-P.y)<40))break;const H=HOMES81[k],inside=(D.npcs||[]).filter(n=>n.l81&&n.l81.hid==='home'&&n.l81.h===k);
   sfx('thud');if(!inside.length){say('🚪 '+H.n+' — ตอนนี้ไม่มีใครอยู่บ้าน (ออกไปทำงานกันหมด)');return true}
   talk({name:'🚪 '+H.n,c:'#c8a060'},'ก๊อก ๆ ๆ... มีเสียงตอบจากในบ้าน\n'+inside.map(n=>'• '+(n.dn||n.name)).join('\n')+'\nจะเรียกใครออกมาคุย?',inside.slice(0,6).map(n=>({t:'🙋 '+(n.dn||n.name),f:()=>{setTimeout(()=>{try{npcTalk(n)}catch(e){}},60)}})).concat([BYE]),'🏠 เคาะประตู');return true}}}catch(e){console.warn('[knock81]',e)}return _it.apply(this,arguments)};W81.interact=interact}
// ป้ายชื่อบ้านเมื่อเดินใกล้
{const _h=hero;hero=function(){const r=_h.apply(this,arguments);try{if(D&&D.town&&!D.shop&&!window.__IN_OTHER8&&ctx.canvas.isConnected){
  for(const k of ['A','B']){const [hx,hy]=doorPt81(k),dp=Math.hypot(P.x-hx,P.y-hy);if(dp>500)continue;const inside=(D.npcs||[]).filter(n=>n.l81&&n.l81.hid==='home'&&n.l81.h===k).length;
   if(dp<70){ctx.save();ctx.font='bold 10px system-ui,"Noto Sans Thai",sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const s='🏠 '+HOMES81[k].n+(inside?' · แตะเพื่อเคาะประตู':'');ctx.strokeText(s,hx,hy+16);ctx.fillStyle='#ffe9b0';ctx.fillText(s,hx,hy+16);ctx.restore()}}}}catch(e){}return r};W81.hero=hero}

}catch(e){console.warn('fix81',e)}
