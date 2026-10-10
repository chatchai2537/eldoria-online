// DPS ทุกอาชีพ (ร่ายสกิลวน+ตีธรรมดา 12 วิ ใส่ของระดับเดียวกัน) — เป้าเดี่ยว (บอส) และกลุ่ม 5 ตัว
// TOUCH=0 node tools/run-game.js game_built.html out 1000 600 @tools/scenarios/classdps.js   (LV=ตั้ง window.LV ก่อนได้)
try{for(const c in CSKILLS)CSK[c]=[1,1,1,1,1,1]}catch(e){}
const sl=ms=>new Promise(r=>setTimeout(r,ms));const LV=window.LV||100,TT=window.TT||7;P.lv=LV;enterZone(NZI15.grove);await sl(2500);for(const row of D.zone.m)row.fill(FL);D.mobs.length=0;D.spT=1e9;D.bossT=1e9;const X0=20*T,Y0=30*T;const out={};
for(const c of Object.keys(CLS).filter(k=>k!=='none')){P.cls=c;const w='cw_'+c+TT;GEAR[w]=1;P.armor.sword=ITEMS[w]?w:NEEDW[c]+TT;for(const s of ['helm','chest','pants','arm','neck','ring'])P.armor[s]=s+TT;try{syncSword()}catch(e){}recalcStats();
 for(const grp of [1,5]){MIN.length=0;D.mobs.length=0;const ms=[];const dist=isRng()?170:45;for(let j=0;j<grp;j++){const m=mkMob('golem','หุ่น',['#888','#444','#fff'],LV,X0+dist+(j%3)*26,Y0+(j-2)*22,{boss:grp===1?1:0});if(grp===1)m.boss=1;m.hp=m.mhp=1e9;m.atk=0;m.hx=m.x;m.hy=m.y;D.mobs.push(m);ms.push(m)}
  for(let k=0;k<6;k++)CS.cd[k]=0;P.mp=BAL.mp;const pin=setInterval(()=>{P.x=X0;P.y=Y0;P.dir='r';P.hp=BAL.hp;for(const m of ms){m.x=m.hx;m.y=m.hy;m.vx=m.vy=0;m.st='idle';m.hp=Math.max(m.hp,1e8)}},10);await sl(300);const h0=ms.reduce((s,m)=>s+m.hp,0);
  const iv=setInterval(()=>{for(let i=5;i>=0;i--){if((CS.cd[i]||0)<=0&&P.mp>40){try{useSkill(i)}catch(e){}break}}P.draw=true;P.tool='sword';try{attack()}catch(e){}},130);await sl(12000);clearInterval(iv);clearInterval(pin);await sl(300);
  out[c]=(out[c]||'')+(grp===1?'':'/')+Math.round((h0-ms.reduce((s,m)=>s+m.hp,0))/12.3)}MIN.length=0}
return out
