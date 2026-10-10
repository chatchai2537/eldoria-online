// วัด DPS 8 วินาทีเทียบกัน (หุ่นเลือดไม่จำกัด): นักดาบตี / นักเวทยิง / เนโคร+โครงกระดูก / กองทัพผู้อัญเชิญ / สู้บอส — ~4 นาที
// node tools/run-game.js game_built.html dps 1000 600 @tools/scenarios/dps.js
try{for(const c in CSKILLS)CSK[c]=[1,1,1,1,1,1]}catch(e){} // v4.57 skill buy: สกิล 4–6 ต้องซื้อ — ในเทสให้ถือว่าเรียนแล้ว
const sl=ms=>new Promise(r=>setTimeout(r,ms));P.lv=80;recalcStats();enterZone(NZI15.grove);await sl(2500);
for(const row of D.zone.m)row.fill(FL);D.mobs.length=0;D.spT=1e9;D.bossT=1e9;const X0=20*T,Y0=30*T;
const setCls=k=>{P.cls=k;const wid=NEEDW[k]+4;GEAR[wid]=1;P.armor.sword=wid;try{syncSword()}catch(e){}recalcStats();P.hp=BAL.hp;P.mp=BAL.mp};
const test=async(label,k,setup,spam,boss)=>{setCls(k);MIN.length=0;D.mobs.length=0;const m=mkMob('golem','หุ่น',['#888','#444','#fff'],60,X0+60,Y0,boss?{boss:1}:{});if(boss)m.boss=1;m.hp=m.mhp=1e9;D.mobs.push(m);
 const pin=setInterval(()=>{P.x=X0;P.y=Y0;P.dir='r';P.hp=BAL.hp;m.x=X0+60;m.y=Y0;m.vx=m.vy=0;m.st='idle';m.stt=9},10);
 setup();await sl(1500);const h0=m.hp;let iv=null;if(spam)iv=setInterval(()=>{P.draw=true;P.tool='sword';attack()},110);await sl(8000);if(iv)clearInterval(iv);clearInterval(pin);
 return {label,dps:Math.round((h0-m.hp)/8),atk:Math.round(ATK()),minions:MIN.length}};
const R=[];
R.push(await test('นักดาบ ตีธรรมดา','sword',()=>{},true));
R.push(await test('นักเวท ยิงธรรมดา','mage',()=>{},true));
R.push(await test('เนโคร ยิงธรรมดา','necro',()=>{},true));
R.push(await test('เนโคร โครงกระดูก 6 ตัว (ยืนเฉย)','necro',()=>summon('skel',6),false));
R.push(await test('เนโคร โครง 6 + ยิง','necro',()=>summon('skel',6),true));
R.push(await test('ผู้อัญเชิญ หมาป่า4+หมี+ราชสีห์+เหยี่ยว (ยืนเฉย)','summoner',()=>{summon('wolf',4);summon('bear',1);summon('lion',1);summon('hawk',1)},false));
R.push(await test('นักเวท อัญเชิญเดิม (skel2+spirit+golem)','mage',()=>{summon('skel',2);summon('spirit',1);summon('golem',1)},false));
R.push(await test('เนโคร โครง 6 vs บอส','necro',()=>summon('skel',6),false,true));
R.push(await test('นักดาบ ตี vs บอส','sword',()=>{},true,true));
// เอาชีวิตรอด: กองทัพผู้อัญเชิญ vs บอส Lv60 15 วิ
setCls('summoner');MIN.length=0;D.mobs.length=0;const b=mkMob('golem','บอสทดสอบ',['#888','#444','#fff'],60,X0+80,Y0,{boss:1});b.boss=1;b.hp=b.mhp=1e9;D.mobs.push(b);
const pin2=setInterval(()=>{P.x=X0;P.y=Y0;P.hp=BAL.hp;b.x=X0+80;b.y=Y0;b.vx=b.vy=0},10);summon('wolf',4);summon('bear',1);summon('lion',1);summon('hawk',1);
const cnt=[];for(let i=0;i<6;i++){await sl(2500);cnt.push(MIN.length)}clearInterval(pin2);R.push({label:'สมุนที่เหลือทุก 2.5 วิ (สู้บอส Lv60)',cnt,bossAtk:b.atk});
return R
