// fix85 (v4.75) — เจ้าของสั่ง (HANDOFF ข้อ 39): "ลบระบบทำฟาร์มออกทั้งหมด แล้วแก้เควสด้วย · ไม่ต้องชดเชย"
//  ปิดระบบทำฟาร์มทั้งหมดแบบห่อทับ (ไม่รื้อโค้ดเดิม): ปลูกผัก/รดน้ำ/เก็บเกี่ยว · สัตว์ฟาร์ม · ต้นไม้ผล/รังผึ้ง/คอก/สปริงเกอร์/บ่อน้ำ
//   · ระดับฟาร์ม+สมุดฟาร์ม (fix78) · จัดฟาร์มตามแบบ (fix79) · ฟาร์ม 3D (fix80) · ร้านเมล็ด/จอบ/บัว/เคียว/หญ้าแห้ง · ขายผลผลิต
//  ที่ยังอยู่: ที่ดินผู้กล้า · บ้าน · ของตกแต่ง · เตาครัว (ทำอาหาร) · ค้อนช่าง · ร้านสัตว์ขี่/สัตว์เลี้ยงของลุงบุญมี (และร้านสัตว์ในเมือง)
//  ของฟาร์มที่ผู้เล่นวางไว้ (สิ่งปลูกสร้างฟาร์ม สัตว์ แปลงผัก) ถูกย้ายไปเก็บใน HOME.old85 (ไม่แสดง ไม่ทำงาน — เผื่อกู้คืน) ไม่ชดเชยตามที่เจ้าของสั่ง
//  เควส: บท 19 (เก็บผลผลิต 40 ชิ้น) → "กวาดล้างผืนดิน" กำจัดมอนสเตอร์ 80 ตัว · แก้คำพูดบท 13/18/บทส่งท้าย · เควสรอง s8–s10 ไม่ใช้ของฟาร์มแล้ว
//  ทำอาหาร: วัตถุดิบที่เคยได้จากฟาร์ม (ไข่ นม มะเขือเทศ ข้าวสาลี สตรอว์เบอร์รี) ซื้อได้ที่ "แผงของไร่ลุง" ในเมือง · เอาเมนูที่ต้องใช้ของฟาร์มขั้นสูง 2 เมนูออก
//  ปิดช่องโหว่เดิมไปด้วย: ซื้อฟักทอง 12🪙 จากแผงในเมือง แล้วขายที่ลุงบุญมี 160🪙 (หน้า "ขายผลผลิต" ถูกเอาออก)
try{
const FARMB85=['coop','barn','well','spr1','spr2','spr3','ft_apple','ft_orange','ft_peach','ft_mango','ft_cherry','hive77','sty'];
const FARMT85=['hoe','can','sick'];
const farmAnim85=k=>{try{const a=ANIMS.find(q=>q.k===k);return !!(a&&a.homeOnly)}catch(e){return false}};
const MSG85='🌾 ระบบทำฟาร์มถูกยกเลิกแล้ว';
window.FARM85={B:FARMB85,T:FARMT85};

// ---------- 1) เก็บของฟาร์มที่วางไว้ออกจากที่ดิน (ทำซ้ำได้ · เซฟที่โหลดทีหลังก็โดนเก็บ) ----------
function purge85(){try{if(typeof HOME==='undefined'||!HOME)return false;let ch=false;
  const fb=(HOME.builds||[]).filter(b=>FARMB85.includes(b.k)),tk=Object.keys(HOME.tiles||{}),an=HOME.animals||[];
  // ของฟาร์มในกระเป๋าที่ใช้ไม่ได้แล้ว: เมล็ด · หญ้าแห้ง · จอบ/บัว/เคียว (ผลผลิตยังอยู่ — กิน/ทำอาหารได้)
  const junk=[];try{for(const k in inv)if((inv[k]|0)>0&&(/^sd_/.test(k)||k==='hay'||FARMT85.some(t=>k==='t_'+t)))junk.push(k)}catch(e){}
  if(!fb.length&&!tk.length&&!an.length&&!junk.length)return false;
  const old=HOME.old85||(HOME.old85={builds:[],animals:[],tiles:{}});
  if(junk.length){old.inv=old.inv||{};for(const k of junk){old.inv[k]=(old.inv[k]|0)+(inv[k]|0);inv[k]=0}ch=true;try{refreshInv()}catch(e){}}
  if(fb.length){old.builds.push.apply(old.builds,fb);HOME.builds=HOME.builds.filter(b=>!FARMB85.includes(b.k));ch=true}
  if(an.length){old.animals.push.apply(old.animals,an);HOME.animals=[];ch=true}
  if(tk.length){for(const k of tk)old.tiles[k]=HOME.tiles[k];HOME.tiles={};ch=true}
  if(ch){try{if(ZCACHE[300]){if(D&&D.home){for(const k of tk){const p=k.split(',').map(Number);try{homePaintTile(p[0],p[1])}catch(e){}}homeObjects()}else delete ZCACHE[300]}}catch(e){}
   try{saveHome()}catch(e){}}
  return ch}catch(e){return false}}
window.purge85=purge85;
purge85();setInterval(()=>{try{purge85();if(FARMT85.includes(P.tool)){P.tool='sword';try{stowItem()}catch(e){}}}catch(e){}},5000);
{const _eh=enterHome;enterHome=function(){try{purge85()}catch(e){}return _eh.apply(this,arguments)};window.enterHome=enterHome}

// ---------- 2) เครื่องมือ/การกระทำของฟาร์ม ----------
for(const k of FARMT85){const i=TOOLKEYS.indexOf(k);if(i>=0)TOOLKEYS.splice(i,1)} // เหลือค้อนช่าง
{const _q=quickUseId;quickUseId=function(id){if(typeof id==='string'&&(/^sd_/.test(id)||FARMT85.some(k=>id==='t_'+k))){say(MSG85);sfx('thud');return}return _q.apply(this,arguments)};window.quickUseId=quickUseId}
{const _qc=qCands;qCands=function(){return _qc.apply(this,arguments).filter(o=>!(o&&typeof o.id==='string'&&(/^sd_/.test(o.id)||FARMT85.some(k=>o.id==='t_'+k))))};window.qCands=qCands}
{const _hu=homeUse;homeUse=function(){try{if(D&&D.home&&FARMT85.includes(P.tool)){P.tool='sword';try{stowItem()}catch(e){}say(MSG85);return true}}catch(e){}return _hu.apply(this,arguments)};window.homeUse=homeUse}
{const _lb=lifeBuy;lifeBuy=function(id){if(typeof id==='string'&&(/^sd_/.test(id)||id==='hay'||FARMT85.some(k=>id==='t_'+k))){say(MSG85);return}return _lb.apply(this,arguments)};window.lifeBuy=lifeBuy}
{const _ba=buyAnimal;buyAnimal=function(k){if(farmAnim85(k)){say(MSG85);return}return _ba.apply(this,arguments)};window.buyAnimal=buyAnimal}
{const _sp=startPlace;startPlace=function(k){if(FARMB85.includes(k)){say(MSG85);return}return _sp.apply(this,arguments)};window.startPlace=startPlace}
{const _ls=lifeSell;lifeSell=function(){say('💰 ลุงบุญมีไม่รับซื้อผลผลิตแล้ว — เอาไปกิน ทำอาหาร หรือขายในตลาดนัดได้');return};window.lifeSell=lifeSell}
{const _nd=newDay;newDay=function(){const s0=sysSay;sysSay=function(t){if(/พืชที่รดน้ำ/.test(String(t)))return;return s0.apply(this,arguments)};try{return _nd.apply(this,arguments)}finally{sysSay=s0}};window.newDay=newDay}
try{window.open3D79=function(){say(MSG85)}}catch(e){}

// ---------- 3) หน้าต่างที่ดิน/ร้านลุงบุญมี: เอาของฟาร์มออกจากรายการ ----------
try{for(const k in BLD)if(BLD[k]&&BLD[k].lv77)BLD[k].lv77=0}catch(e){} // ของตกแต่งที่เคยล็อกด้วยระดับฟาร์ม → ปลดล็อก (ระดับฟาร์มเพิ่มไม่ได้แล้ว)
{const st=document.createElement('style');st.textContent='#farm77,#f3db79,#afb9{display:none!important}';document.head.appendChild(st)}
try{if(typeof AF9!=='undefined')AF9.on=false}catch(e){} // ออโต้ฟาร์มในที่ดิน (รดน้ำ/เก็บเกี่ยวอัตโนมัติ) ปิดถาวร
function clean85(){if(typeof lifeEl==='undefined'||!lifeEl||lifeEl.hidden)return;
 for(const it of Array.prototype.slice.call(lifeEl.querySelectorAll('.it'))){const tx=it.textContent||'';let kill=/จัดฟาร์มตามแบบ/.test(tx),keep=false;
  for(const b of it.querySelectorAll('button[onclick]')){const oc=b.getAttribute('onclick')||'';let m;
   if((m=/lifeBuy\('([^']+)'/.exec(oc))){if(/^sd_/.test(m[1])||m[1]==='hay'||FARMT85.some(k=>m[1]==='t_'+k))kill=true;else keep=true}
   else if((m=/buyAnimal\('([^']+)'/.exec(oc))){if(farmAnim85(m[1]))kill=true;else keep=true}
   else if((m=/startPlace\('([^']+)'/.exec(oc))){if(FARMB85.includes(m[1]))kill=true;else keep=true}
   else if((m=/upTool\('([^']+)'/.exec(oc))){if(FARMT85.includes(m[1]))kill=true;else keep=true}
   else if(/lifeSell\(/.test(oc))kill=true;else keep=true}
  if(!kill&&!keep&&/ระดับฟาร์ม/.test(tx))kill=true; // การ์ดระดับฟาร์ม (ไม่มีปุ่มของที่ยังใช้ได้)
  if(kill)it.remove()}
 for(const b of lifeEl.querySelectorAll('button[onclick]')){const oc=b.getAttribute('onclick')||'';
  if(oc.indexOf("lifeTab('farm')")>=0)b.textContent='🍳 ครัว';
  else if(oc.indexOf("lifeTab('shop')")>=0)b.textContent='🔨 ของใช้';
  else if(oc.indexOf("lifeTab('sell')")>=0)b.remove()}
 // หัวหน้าต่าง: "ร้านฟาร์มลุงบุญมี" → "ร้านลุงบุญมี" · เอาป้าย "🌾 ฟาร์ม Lv." ออก
 const w=document.createTreeWalker(lifeEl,NodeFilter.SHOW_TEXT,null),rm=[];let n;
 while((n=w.nextNode())){const t=n.nodeValue;if(!t)continue;if(/ฟาร์ม Lv\.\s*\d+/.test(t)){const pe=n.parentNode;if(pe&&pe!==lifeEl&&pe.childNodes.length===1&&!pe.classList.contains('it'))rm.push(pe);else n.nodeValue=t.replace(/🌾?\s*ฟาร์ม Lv\.\s*\d+/g,'')}
  else if(t.indexOf('ร้านฟาร์ม')>=0)n.nodeValue=t.replace(/ร้านฟาร์ม/g,'ร้าน')}
 for(const e of rm)e.remove()}
{const _r=renderLife;renderLife=function(){if(LIFE.tab==='sell')LIFE.tab='pet';const r=_r.apply(this,arguments);try{clean85()}catch(e){}return r};window.renderLife=renderLife}

// ---------- 4) ลุงบุญมี (ที่ดินผู้กล้า): เหลือร้านสัตว์ขี่/สัตว์เลี้ยง + ของใช้ ----------
try{RANCHER.lines=['อยากได้สัตว์ขี่หรือสัตว์เลี้ยงคู่ใจ บอกลุงได้เลย','ม้าของลุงวิ่งเร็วที่สุดในเอลโดเรียนะหลาน','ดูแลมันให้ดี มันจะอยู่กับเจ้าไปอีกนาน','ค้อนช่างดี ๆ สร้างบ้านได้หลังใหญ่ขึ้นนะ']}catch(e){}
{const _ha=homeAct;homeAct=function(){try{if(D&&D.home&&Math.hypot(P.x-RANCHER.x,P.y-RANCHER.y)<52){
    talk(RANCHER,pick(RANCHER.lines),[{t:'🐾 สัตว์เลี้ยง / สัตว์ขี่',c:'go',f:()=>openLife('pet')},{t:'🔨 ของใช้ (ค้อนช่าง · ช่อดอกไม้)',f:()=>openLife('shop')},BYE]);return true}}catch(e){}
  return _ha.apply(this,arguments)};window.homeAct=homeAct}
{const _oz=openZMenu;openZMenu=function(){const r=_oz.apply(this,arguments);try{for(const b of shopEl.querySelectorAll('button.zbtn')){if(/ที่ดินผู้กล้า/.test(b.textContent)){const s=b.querySelector('small');if(s)s.textContent='สร้างและตกแต่งบ้าน ทำอาหาร นอนพักรับบัฟ'}}}catch(e){}return r};window.openZMenu=openZMenu}

// ---------- 5) เนื้อเรื่อง ----------
try{const fx=(i,from,to)=>{const c=STCH[i];if(c&&Array.isArray(c.done))c.done=c.done.map(s=>String(s).replace(from,to))};
 fx(13,'จงสร้างบ้าน ปลูกผัก เลี้ยงสัตว์ และใช้ชีวิตอย่างสงบสุขที่เจ้าสมควรได้รับ','จงสร้างบ้านของเจ้าที่นั่น และใช้ชีวิตอย่างสงบสุขที่เจ้าสมควรได้รับ');
 const c18=STCH.find(c=>c&&c.id==='lb1');if(c18&&Array.isArray(c18.done))c18.done=c18.done.map(s=>/ผืนดินอ่อนแอ/.test(s)?'นักบวชบอกว่าอสูรที่เพ่นพ่านทั่วแผ่นดินคอยกัดกินพลังของผนึก — ต้องกวาดล้างพวกมันเสียก่อน':s);
 const c19=STCH.find(c=>c&&c.id==='farm'),kills=()=>(typeof ST20!=='undefined'?ST20.kills|0:0);
 if(c19){c19.id='purge';c19.t='บทที่ 19: กวาดล้างผืนดิน';c19.d='กำจัดมอนสเตอร์ 80 ตัว (ในเหมือง แมพป่า หรือดันเจี้ยน ที่ไหนก็ได้)';
  c19.need=()=>{const k=kills();if(STCH[STORY.ch]!==c19)return [0,80];if(typeof STORY.b85!=='number'||STORY.b85>k){STORY.b85=k;try{saveStory()}catch(e){}}return [k-STORY.b85,80]};
  c19.sat=()=>{STORY.b85=kills()-80};
  c19.intro='อสูรที่หลุดออกมาจากรอยร้าวของผนึกกระจายไปทั่วแผ่นดิน ทั้งในเหมือง ในป่า และใต้ดันเจี้ยน ยิ่งพวกมันมาก ผนึกยิ่งอ่อนแรง — ออกไปกวาดล้างพวกมันให้ได้ 80 ตัว';
  c19.done=['ดูสิ! รอยร้าวบนแท่นผนึกเริ่มเลือนลง แผ่นดินที่ปลอดอสูรส่งพลังกลับไปจริง ๆ','แต่ศึกที่จะมาถึงต้องการอาวุธที่แข็งแกร่งยิ่งกว่านี้']}
 const ep=STCH.find(c=>c&&c.free);if(ep&&ep.intro)ep.intro=String(ep.intro).replace('ตีบวก ทำฟาร์ม หรือท้าดันเจี้ยน','ตีบวก ตกแต่งบ้าน หรือท้าดันเจี้ยน')}catch(e){console.warn('fix85 story',e)}

// ---------- 6) เควสรองที่เคยใช้ของฟาร์ม ----------
try{const sq=(id,o)=>{const q=SIDE.find(x=>x.id===id);if(q){delete q.home;Object.assign(q,o)}};
 sq('s8',{t:'ไม้ซ่อมยุ้งฉาง',d:'นำไม้ 30 ท่อนมาให้',item:{wood:30},rw:{coin:900,estone:1},a:'ยุ้งฉางข้าผุหมดแล้ว หน้าฝนนี้ข้าวจะเปียกหมด ช่วยหาไม้มาให้ข้าซ่อมทีเถอะ',b:'ยุ้งฉางแข็งแรงแล้ว ขอบใจมากนะผู้กล้า!'});
 sq('s9',{t:'ปลานิลงานเทศกาล',d:'นำปลานิล 4 ตัวมาให้ (ตกปลาที่ริมน้ำ)',item:{tilapia:4},a:'งานเทศกาลใกล้แล้ว แผงฉันยังขาดปลานิลสด ๆ อยู่เลยจ้า',b:'ปลาสดมาก! เอาเค้กไปกินนะจ๊ะ'});
 sq('s10',{t:'ขนมปังยามเช้า',d:'นำขนมปังอุ่น ๆ 6 ก้อนมาให้ (ร้านชำป้าแดง / ร้านขนมปัง)',item:{bread:6},a:'อยากทำอาหารเช้าให้คุณแม่ แต่ไปซื้อขนมปังไม่ทันเลย…',b:'ขอบคุณนะ… คุณใจดีจัง'})}catch(e){console.warn('fix85 side',e)}

// ---------- 7) ทำอาหาร: วัตถุดิบซื้อได้ในเมือง ----------
try{delete DISH.fruitpie;delete DISH.truffrice;
 const S=SD.st_farm;if(S&&S.buy){const add=(id,nm,e,p)=>{if(!S.buy.some(b=>b.give===id))S.buy.push({id:'f_'+id,name:nm,mat:id,emoji:e,price:p,give:id,note:'วัตถุดิบทำอาหาร (เตาครัวในที่ดินผู้กล้า)'})};
  add('egg','ไข่ไก่สด','🥚',70);add('milk','นมวัวสด','🥛',110);add('tomato','มะเขือเทศ','🍅',55);add('wheat','ข้าวสาลี','🌾',30);add('strawberry','สตรอว์เบอร์รี','🍓',80)}
 for(const k of ['egg','milk','tomato','wheat','strawberry'])if(INVMETA[k])INVMETA[k][1]='วัตถุดิบทำอาหาร · ซื้อได้ที่แผงของไร่ลุงในเมือง'}catch(e){console.warn('fix85 cook',e)}

// ---------- 8) คู่มือผู้กล้า ----------
{const fix=()=>{try{const el=gid('gb66');if(!el)return;for(const d of el.querySelectorAll('details')){const s=d.querySelector('summary'),b=d.querySelector('div');if(!s||!b)continue;
    if(/ที่ดินผู้กล้า/.test(s.textContent)){s.textContent='🏡 ที่ดินผู้กล้า (บ้าน)';b.innerHTML='ปลดล็อกหลังจบบท 13 · ไปที่<b>ประตูมิติในทุ่งหญ้า → 🏡</b> · ใส่<b>ค้อนช่าง</b>ในช่องลัดแล้วกดโจมตี = เปิดเมนูสร้าง: <b>บ้าน</b> (นอนแล้วได้บัฟ) · <b>เตาครัว</b> (ทำอาหารบัฟ) · <b>ของตกแต่ง</b> · วัตถุดิบทำอาหารซื้อได้ที่<b>แผงของไร่ลุง</b>และแผงผักในเมือง · ปลาได้จากการตกปลา'}
    else if(/ปลูกผัก|เลี้ยงสัตว์/.test(b.innerHTML))b.innerHTML=b.innerHTML.replace(/ปลูกผัก\/เลี้ยงสัตว์/g,'สร้างบ้าน/ตกแต่ง')}}catch(e){}};
 const wrap=nm=>{const f=window[nm];if(typeof f!=='function')return null;const g=function(){const r=f.apply(this,arguments);fix();return r};window[nm]=g;return g};
 const g77=wrap('openGuide77');wrap('openGuide66');
 try{if(g77){const i=PM7.findIndex(m=>m[1]==='คู่มือ');if(i>=0)PM7[i]=['📖','คู่มือ',()=>window.openGuide77()];pmRender7()}}catch(e){}}
}catch(e){console.warn('fix85',e)}
