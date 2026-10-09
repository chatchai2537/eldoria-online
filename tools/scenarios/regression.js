// เทียบพฤติกรรมพื้นฐานระหว่างเวอร์ชัน (รันกับไฟล์เก่าและใหม่แล้ว diff ผล): ดาเมจตีธรรมดา/สกิลเดิม 3 ท่าทุกอาชีพ ·
// ปุ่มบนจอ · error ใน console (ดาเมจสุ่มแกว่ง ±30% — รัน 2 รอบต่อเวอร์ชันก่อนสรุป · NPC/เควสใช้ quests.js)
// node tools/run-game.js <ไฟล์> out 1000 600 @tools/scenarios/regression.js
const sl=ms=>new Promise(r=>setTimeout(r,ms));const OUT={err:[],cls:{},ui:{}};
const oe=window.onerror;window.addEventListener('error',e=>OUT.err.push(String(e.message).slice(0,120)));
// 3) ดาเมจตีธรรมดา + สกิลเดิม 3 ท่า ทุกอาชีพ (หุ่นเลือดไม่จำกัด ในแมพที่ลบกำแพง)
P.lv=80;recalcStats();enterZone(0);await sl(2500);for(const row of D.zone.m)row.fill(FL);D.mobs.length=0;D.spT=1e9;D.bossT=1e9;const X0=20*T,Y0=20*T;
const dmgOf=async(fn,ms)=>{D.mobs.length=0;const m=mkMob('golem','หุ่น',['#888','#444','#fff'],60,X0+50,Y0);m.hp=m.mhp=1e9;m.atk=0;D.mobs.push(m);
 const pin=setInterval(()=>{P.x=X0;P.y=Y0;P.dir='r';P.hp=BAL.hp;P.mp=BAL.mp;m.x=X0+50;m.y=Y0;m.vx=m.vy=0},10);await sl(200);const h0=m.hp;try{await fn()}catch(e){OUT.err.push('act '+e.message)}await sl(ms);clearInterval(pin);MIN.length=0;return Math.round(h0-m.hp)};
for(const k of Object.keys(CLS).filter(c=>c!=='none')){P.cls=k;const wid=NEEDW[k]+3;GEAR[wid]=1;P.armor.sword=wid;try{syncSword()}catch(e){}recalcStats();try{updSkBar()}catch(e){}
 const r={};r.basic=await dmgOf(async()=>{const iv=setInterval(()=>{P.draw=true;P.tool='sword';attack()},120);await sl(3000);clearInterval(iv)},300);
 for(let i=0;i<3;i++){r['s'+i]=await dmgOf(async()=>{for(let i2=0;i2<CS.cd.length;i2++)CS.cd[i2]=0;CS.step=0;useSkill(i);if(CSKILLS[k][i].steps){await sl(700);useSkill(i);await sl(700);useSkill(i)}},2600)}
 OUT.cls[k]=r}
// 5) ปุ่มบนจอ
for(const b of document.querySelectorAll('#acts > *,#bar,#chatTg'))OUT.ui[b.id||b.className]=getComputedStyle(b).display;
return OUT
