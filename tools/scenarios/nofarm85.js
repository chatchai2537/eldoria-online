// ทดสอบ "ลบระบบทำฟาร์ม" (v4.75 fix85): ของฟาร์มในเซฟเก่าถูกเก็บออก · เมนู/ร้านไม่มีของฟาร์ม · ทางเข้าฟาร์มถูกปิด · เควส/ร้าน/ทำอาหารยังเดินได้
// ใช้: TOUCH=0 node tools/run-game.js game_built.html out 1000 600 @tools/scenarios/nofarm85.js  → ต้องได้ fail: []
const fail=[],ok=(c,m)=>{if(!c)fail.push(m)},r={},wait=ms=>new Promise(q=>setTimeout(q,ms));
window.__er=[];addEventListener('error',e=>window.__er.push(String(e.message)));
P.lv=110;recalcStats();P.hp=BAL.hp;inv.coin=5e6;HOME.unlocked=1;HOME.house=Math.max(HOME.house|0,2);HOME.tools.hamr=5;inv.t_hamr=1;inv.t_hoe=1;inv.t_can=1;inv.t_sick=1;inv.sd_turnip=5;
// จำลองเซฟเก่าที่มีฟาร์มอยู่
const bx=HLOT.x+HLOT.w+3,by=HLOT.y+2;
HOME.builds.push({k:'coop',x:bx,y:by},{k:'ft_apple',x:bx+4,y:by,g:8},{k:'well',x:bx,y:by+4},{k:'kitchen',x:bx+4,y:by+4},{k:'lamp',x:bx+8,y:by+4});
HOME.animals.push({k:'chicken',x:(bx+1)*32,y:(by+3)*32,vx:1,ph:0,heart:1});
HOME.tiles[(bx+8)+','+(by+8)]={till:1,crop:{k:'turnip',s:1}};HOME.tiles[(bx+9)+','+(by+8)]={till:1};
r.purged=purge85();
ok(r.purged===true,'purge85 ต้องเก็บของฟาร์มออก');
ok(HOME.builds.every(b=>!FARM85.B.includes(b.k)),'ต้องไม่เหลือสิ่งปลูกสร้างฟาร์ม');ok(HOME.builds.some(b=>b.k==='kitchen')&&HOME.builds.some(b=>b.k==='lamp'),'เตาครัว/ของตกแต่งต้องยังอยู่');
ok(HOME.animals.length===0&&Object.keys(HOME.tiles).length===0,'สัตว์ฟาร์ม/แปลงผักต้องหมด');
ok(HOME.old85&&HOME.old85.builds.length===3&&HOME.old85.animals.length===1&&Object.keys(HOME.old85.tiles).length===2,'ของเดิมต้องถูกเก็บไว้ใน HOME.old85');
ok(!inv.sd_turnip&&!inv.t_hoe&&!inv.t_can&&!inv.t_sick&&inv.t_hamr===1,'เมล็ด/จอบ/บัว/เคียวในกระเป๋าต้องถูกเก็บออก (ค้อนยังอยู่)');
ok(purge85()===false,'purge85 รอบสองต้องไม่มีอะไรให้เก็บ');
// เข้าที่ดิน
enterHome();await wait(1500);ok(D&&D.home,'ต้องเข้าที่ดินได้');
// หน้าต่างที่ดินแต่ละแท็บ
const cards=()=>Array.prototype.map.call(lifeEl.querySelectorAll('.it'),e=>{const b=e.querySelector('b');return b?b.textContent.trim():''}).filter(Boolean);
const tabs=()=>Array.prototype.map.call(lifeEl.querySelectorAll('button[onclick^="lifeTab("]'),b=>b.textContent.trim());
openLife('house');r.houseTabs=tabs();openLife('farm');r.farm=cards();openLife('deco');r.deco=cards().length;r.decoHasPreset=/จัดฟาร์มตามแบบ/.test(lifeEl.textContent);
openLife('tools');r.tools=cards();openLife('shop');r.shopTabs=tabs();r.shop=cards();openLife('pet');r.pet=cards();openLife('sell');r.sellRedirect=LIFE.tab;
ok(r.farm.length===1&&/เตาครัว/.test(r.farm[0]),'แท็บสิ่งปลูกสร้างต้องเหลือแค่เตาครัว (ได้ '+r.farm.join(',')+')');ok(r.deco>10&&!r.decoHasPreset,'แท็บตกแต่งต้องยังมีของ และไม่มีปุ่มจัดฟาร์มตามแบบ');
ok(r.tools.length===1,'แท็บเครื่องมือต้องเหลือค้อนอย่างเดียว (ได้ '+r.tools.length+')');ok(!r.shop.some(n=>/เมล็ด|หญ้าแห้ง|จอบ|บัว|เคียว/.test(n)),'ร้านลุงบุญมีต้องไม่มีเมล็ด/หญ้าแห้ง/เครื่องมือฟาร์ม (ได้ '+r.shop.join(',')+')');
ok(!r.pet.some(n=>/^(ไก่|วัวนม|แกะ|เป็ด|กระต่าย|แพะ|หมูแคระ)/.test(n)),'ร้านสัตว์ต้องไม่มีสัตว์ฟาร์ม');ok(r.pet.some(n=>/ม้าศึก/.test(n))&&r.pet.some(n=>/หมาชิบะ/.test(n)),'ร้านสัตว์ต้องยังมีสัตว์ขี่/สัตว์เลี้ยง');
ok(!r.shopTabs.some(t=>/ขายผลผลิต/.test(t))&&r.sellRedirect!=='sell','ต้องไม่มีแท็บขายผลผลิต');openLife('pet');r.head=(lifeEl.textContent||'').slice(0,60);ok(!/ฟาร์ม/.test(lifeEl.textContent),'หน้าต่างร้านต้องไม่มีคำว่าฟาร์มเลย (หัว: '+r.head+')');openLife('house');ok(!/ฟาร์ม/.test(lifeEl.textContent),'หน้าต่างสร้างบ้านต้องไม่มีคำว่าฟาร์ม');ok(!/ระดับฟาร์ม/.test(lifeEl.textContent),'ต้องไม่มีคำว่าระดับฟาร์มในหน้าต่าง');
try{closeLife()}catch(e){lifeEl.hidden=true;PAUSED=false}
// ทางเข้าฟาร์มถูกปิด
const c0=inv.coin,s0=inv.sd_turnip|0;lifeBuy('sd_turnip',10);lifeBuy('hay',15);buyAnimal('chicken');startPlace('coop');
ok(inv.coin===c0&&(inv.sd_turnip|0)===s0&&HOME.animals.length===0,'ซื้อเมล็ด/หญ้าแห้ง/ไก่ต้องไม่ได้');ok(!PLACE.k,'วางเล้าไก่ต้องไม่ได้');
P.tool='sword';quickUseId('t_hoe');ok(P.tool!=='hoe','หยิบจอบต้องไม่ได้');quickUseId('sd_turnip');
P.tool='hoe';P.draw=true;const t0=Object.keys(HOME.tiles).length;homeUse();ok(Object.keys(HOME.tiles).length===t0&&P.tool!=='hoe','ขุดแปลงต้องไม่ได้');
r.qc=qCands().map(o=>o.id).filter(id=>/^sd_|^t_/.test(id));ok(r.qc.every(id=>id==='t_hamr'),'ช่องลัดต้องเสนอแค่ค้อน (ได้ '+r.qc.join(',')+')');
ok(['farm77','f3db79','afb9'].every(i=>getComputedStyle(gid(i)).display==='none'),'ป้ายระดับฟาร์ม/ปุ่มฟาร์ม 3D/ปุ่มออโต้ฟาร์ม ต้องซ่อน');
// ลุงบุญมี
P.x=RANCHER.x;P.y=RANCHER.y+30;PAUSED=false;homeAct();await wait(300);r.rancher=(DLG.open&&DLG.ch?DLG.ch.map(c=>c.t):[]).map(t=>(t.match(/(สัตว์เลี้ยง \/ สัตว์ขี่|ร้านฟาร์ม|ขายผลผลิต|สมุดฟาร์ม|ของใช้)/)||[''])[0]).filter(Boolean);
ok(r.rancher.indexOf('ร้านฟาร์ม')<0&&r.rancher.indexOf('สมุดฟาร์ม')<0&&r.rancher.indexOf('ขายผลผลิต')<0&&r.rancher.some(t=>/สัตว์เลี้ยง/.test(t)),'ลุงบุญมีต้องเหลือร้านสัตว์/ของใช้ (ได้ '+r.rancher.join(',')+')');
try{dlgClose()}catch(e){try{DLG.open=false;gid('dlg').hidden=true}catch(e2){}}
// เนื้อเรื่อง + เควสรอง
const c19=STCH.find(c=>c.id==='purge');ok(c19&&!STCH.some(c=>c.id==='farm'),'บท 19 ต้องเป็นบทใหม่');r.ch19=c19?c19.t+' — '+c19.d:'';
if(c19){const i=STCH.indexOf(c19),ch0=STORY.ch;STORY.ch=i;delete STORY.b85;const a=c19.need();ST20.kills=(ST20.kills|0)+7;const b=c19.need();c19.sat();const c=c19.need();STORY.ch=ch0;r.ch19need=[a,b,c];ok(a[0]===0&&b[0]===7&&c[0]>=80&&a[1]===80,'บท 19 ต้องนับจำนวนมอนที่ฆ่า')}
ok(!STCH.some(c=>/ปลูกผัก|เลี้ยงสัตว์|ทำฟาร์ม|ผลผลิต/.test([c.t,c.d,c.intro,(c.done||[]).join(' ')].join(' '))),'เนื้อเรื่องต้องไม่พูดถึงการทำฟาร์มแล้ว');
r.side=SIDE.filter(q=>['s8','s9','s10'].includes(q.id)).map(q=>q.id+':'+q.t+':'+JSON.stringify(q.item)+(q.home?'[home]':''));ok(!SIDE.some(q=>q.home||(q.item&&(q.item.wheat||q.item.pumpkin||q.item.egg))),'เควสรองต้องไม่ขอของฟาร์ม');
// ทำอาหาร: วัตถุดิบซื้อได้
r.stall=SD.st_farm.buy.map(b=>b.give);ok(['egg','milk','tomato','wheat','strawberry'].every(k=>r.stall.includes(k)),'แผงของไร่ลุงต้องขายวัตถุดิบทำอาหาร');
r.dish=Object.keys(DISH);ok(!DISH.fruitpie&&!DISH.truffrice,'เมนูที่ใช้ของฟาร์มขั้นสูงต้องถูกเอาออก');
ok(r.dish.every(k=>Object.keys(DISH[k].need).every(q=>q==='fish'||q==='dragon'||SD.st_farm.buy.some(b=>b.give===q)||SD.st_veg.buy.some(b=>b.give===q))),'วัตถุดิบของทุกเมนูต้องหาซื้อ/ตกปลาได้');
inv.egg=2;const om0=inv.omelet|0;try{openLife('cook');cookDish('omelet')}catch(e){r.cookErr=e.message}await wait(3500);r.omelet=(inv.omelet|0)-om0;ok(r.omelet===1,'ทำไข่เจียวต้องได้ (ได้ '+r.omelet+')');
try{closeLife()}catch(e){}
r.errs=window.__er.slice(0,5);ok(!r.errs.length,'มี error: '+r.errs.join(' | '));
return Object.assign(r,{fail});
