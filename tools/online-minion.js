// ทดสอบสมุนออนไลน์ (v4.63): A เป็นผู้อัญเชิญ เรียกหมาป่า → B ต้องเห็นสมุนของ A (o.mn) + ภาพ
// รันเซิร์ฟเวอร์ก่อน: DATA_DIR=/tmp/sd PORT=8799 node server.js  แล้ว: node tools/online-minion.js game_built.html ws://localhost:8799 out.png
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,srv,shot]=process.argv;const b=await chromium.launch();
 const open=async(nm)=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(nm=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;netConnect()},nm);return {p,errs}};
 const A=await open('อัญเชิญเอ'),B=await open('ผู้ชมบี');await A.p.waitForTimeout(3000);
 for(const x of [A,B])await x.p.evaluate(()=>{toTown();setTimeout(()=>{enterZone(0)},500)});await A.p.waitForTimeout(4500);
 await A.p.evaluate(()=>{try{GM7.god=true}catch(e){}P.x=20*32;P.y=20*32;P.lv=100;P.cls='summoner';GEAR.staff5=1;P.armor.sword='staff5';try{syncSword()}catch(e){}recalcStats();P.mp=99999;useSkill(0)});
 await B.p.evaluate(()=>{try{GM7.god=true}catch(e){}P.x=20*32+90;P.y=20*32+30;P.lv=100;recalcStats()});await A.p.waitForTimeout(2500);
 const r={aMin:await A.p.evaluate(()=>MIN.length),bSees:await B.p.evaluate(()=>[...NET.others.values()].map(o=>({n:o.name,mn:(o.mn||[]).length})))};
 if(shot)await B.p.screenshot({path:shot});r.errs=[...A.errs,...B.errs].slice(0,5);console.log(JSON.stringify(r,null,1));await b.close()})();
