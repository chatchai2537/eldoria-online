// ทดสอบออนไลน์: A ร่ายสกิล → B ต้องเห็นท่า (o.ps57) · node tools/online-pose.js game_built.html ws://localhost:8799 <ภาพ.png>
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,srv,shot]=process.argv;const b=await chromium.launch();
 const open=async(nm)=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(nm=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;netConnect()},nm);return {p,errs}};
 const A=await open('ท่าเอ'),B=await open('ท่าบี');await A.p.waitForTimeout(2500);
 for(const x of [A,B])await x.p.evaluate(()=>{toTown();setTimeout(()=>{exitD&&D&&exitD();enterZone(0)},500)});await A.p.waitForTimeout(4500);
 await A.p.evaluate(()=>{try{GM7.god=true}catch(e){}P.x=20*32;P.y=20*32;P.lv=120;P.cls='monk';for(const c in CSKILLS)CSK[c]=[1,1,1,1,1,1];const w=NEEDW.monk+3;GEAR[w]=1;P.armor.sword=w;try{syncSword()}catch(e){}recalcStats();P.dir='r'});
 await B.p.evaluate(()=>{try{GM7.god=true}catch(e){}P.x=20*32-60;P.y=20*32+30;P.lv=120;recalcStats()});await A.p.waitForTimeout(1500);
 await A.p.evaluate(()=>{P.mp=BAL.mp;for(let i=0;i<CS.cd.length;i++)CS.cd[i]=0;useSkill(0)});await B.p.waitForTimeout(250);
 const r=await B.p.evaluate(()=>{const o=[...NET.others.values()][0];return {others:NET.others.size,ps:o&&o.ps57&&o.ps57.k,cls:o&&o.cls}});
 if(shot)await B.p.screenshot({path:shot});r.errs=[...A.errs,...B.errs].slice(0,5);console.log(JSON.stringify(r));await b.close()})();
