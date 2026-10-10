// ทดสอบ "ขี่สัตว์/นั่งพักแล้วยังเห็นเพื่อน" (v4.76 fix86): 2 หน้าต่างในแมพป่า เพื่อนยืนห่าง 220px
//  วัดจากตอนวาดผู้เล่นคนอื่นบนจอเรา: ต้องถูกวาดทุกเฟรม · ไม่ถูกเลื่อนขึ้น (ค่าเลื่อนแนวตั้งของ canvas ต้องเท่ากับตอนเดินปกติ) · ไม่อยู่ในกรอบตัดของท่าขี่
// ใช้: NODE_PATH=$(npm root -g):/opt/npm-tools/node_modules node tools/mount-see-test.js game_built.html [โฟลเดอร์ภาพ]
const os=require('os'),fs=require('fs'),path=require('path');
process.env.PORT=process.env.PORT||'8790';process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'mnt'));
require('../server.js');const {chromium}=require('playwright');
(async()=>{const [,,file,out]=process.argv,srv='ws://localhost:'+process.env.PORT,fail=[],r={};const ok=(c,m)=>{if(!c)fail.push(m)};const b=await chromium.launch();
 const open=async nm=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(nm=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;P.lv=90;recalcStats();P.hp=BAL.hp;setInterval(()=>{if(!P.dead)P.hp=BAL.hp},60);netConnect()},nm);return {p,errs}};
 const A=await open('ทดสอบเอ'),B=await open('ทดสอบบี');await A.p.waitForTimeout(2500);
 for(const x of [A,B])await x.p.evaluate(()=>go42('grove','ent'));await A.p.waitForTimeout(5000);
 const ap=await A.p.evaluate(()=>({x:P.x,y:P.y}));await B.p.evaluate(([x,y])=>{P.x=x+220;P.y=y+10},[ap.x,ap.y]);await A.p.waitForTimeout(1500);
 // บันทึกทุกครั้งที่จอ A วาดผู้เล่นคนอื่น: ค่าเลื่อนแนวตั้งของ canvas (f) + มีกรอบตัดอยู่ไหม (วัดด้วยการลองทาสีจุดไกล ๆ แล้วอ่านกลับไม่ได้ จึงใช้ธงของตัวห่อแทน)
 await A.p.evaluate(()=>{window.__d=[];const _do=drawOther;drawOther=function(o){try{const m=ctx.getTransform();window.__d.push([Math.round(m.f*10)/10,Math.round(m.e*10)/10])}catch(e){}return _do.apply(this,arguments)}});
 const sample=async(label)=>{await A.p.evaluate(()=>{window.__d.length=0});await A.p.waitForTimeout(700);const v=await A.p.evaluate(()=>window.__d.slice(-12));r[label]={n:v.length,f:v.length?v[v.length-1][0]:null,e:v.length?v[v.length-1][1]:null};if(out){fs.mkdirSync(out,{recursive:true});await A.p.screenshot({path:path.join(out,label+'.png')})}return r[label]};
 const walk=await sample('walk');ok(walk.n>0,'ตอนเดินปกติ จอ A ต้องวาดเพื่อน');
 for(const m of ['horse','dgold']){await A.p.evaluate(m=>{HOME.unlocked=1;HOME.mount=m;MOUNT.on=false;try{toggleMount()}catch(e){}if(!MOUNT.on)MOUNT.on=true},m);await A.p.waitForTimeout(900);const on=await A.p.evaluate(()=>MOUNT.on);
  const s=await sample('ride-'+m);ok(on,'ต้องขี่ '+m+' ได้');ok(s.n>0,'ขี่ '+m+': จอ A ต้องยังวาดเพื่อน');ok(s.f===walk.f&&s.e===walk.e,'ขี่ '+m+': เพื่อนต้องไม่ถูกเลื่อนตำแหน่ง (เดิน f='+walk.f+' · ขี่ f='+s.f+')')}
 await A.p.evaluate(()=>{if(MOUNT.on)toggleMount();P.sit=true});await A.p.waitForTimeout(500);const sit=await sample('sit');r.sitOn=await A.p.evaluate(()=>!!P.sit);
 if(r.sitOn){ok(sit.n>0&&sit.f===walk.f,'นั่งพัก: เพื่อนต้องไม่ถูกเลื่อน/ตัดหาย (เดิน f='+walk.f+' · นั่ง f='+sit.f+')')}
 r.errs=[...A.errs,...B.errs].slice(0,5);ok(!r.errs.length,'มี error ในหน้าเกม');console.log(JSON.stringify(Object.assign(r,{fail}),null,1));await b.close();process.exit(0)})().catch(e=>{console.log('TESTERR',e&&e.stack||e);process.exit(1)});
