// ทดสอบ "มอนตายเห็นเหมือนกันทุกจอ" (v4.72 fix82 D): เปิดเซิร์ฟเวอร์ในตัว + 2 หน้าต่างในเหมืองเดียวกัน
//  1) โฮสต์ (A) ฆ่ามอน → คนดู (B) ที่ไม่ได้ตี ต้องเห็นเอฟเฟกต์ตาย+ได้ยินเสียง  2) คนดู (B) ฆ่ามอน → โฮสต์ (A) ที่ไม่ได้ตี ต้องเห็นเหมือนกัน
// ใช้: NODE_PATH=$(npm root -g):/opt/npm-tools/node_modules node tools/death-fx-test.js game_built.html
const os=require('os'),fs=require('fs'),path=require('path');
process.env.PORT=process.env.PORT||'8796';process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'dfx'));
require('../server.js');const {chromium}=require('playwright');
(async()=>{const [,,file]=process.argv,srv='ws://localhost:'+process.env.PORT,fail=[],r={};const ok=(c,m)=>{if(!c)fail.push(m)};
 const b=await chromium.launch();
 const open=async nm=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(nm=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;P.lv=120;recalcStats();P.hp=BAL.hp;setInterval(()=>{if(!P.dead)P.hp=BAL.hp},60);
   window.__splat=0;const _s=sfx;sfx=function(n){if(n==='splat')window.__splat++;return _s.apply(this,arguments)};netConnect()},nm);return {p,errs}};
 const A=await open('ทดสอบเอ'),B=await open('ทดสอบบี');await A.p.waitForTimeout(2500);
 await A.p.evaluate(()=>{toTown();setTimeout(()=>{exitD&&D&&exitD();enterZone(0)},500)});await A.p.waitForTimeout(3500);
 await B.p.evaluate(()=>{toTown();setTimeout(()=>{exitD&&D&&exitD();enterZone(0)},500)});await B.p.waitForTimeout(5000);
 r.modes=[await A.p.evaluate(()=>W33.mode),await B.p.evaluate(()=>W33.mode)];ok(r.modes[0]==='host'&&r.modes[1]==='mirror','A=host B=mirror (ได้ '+r.modes+')');
 const pick=x=>x.p.evaluate(()=>{const m=D.mobs.find(q=>!q.dead&&!q.boss&&q.uid);return m?{uid:m.uid,x:m.x,y:m.y}:null});
 const near=(x,uid)=>x.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m){P.x=m.x+30;P.y=m.y+6}return !!m},uid);
 const snap=x=>x.p.evaluate(()=>({splat:window.__splat,fx:fx.length}));
 // 1) โฮสต์ฆ่า → คนดูไม่ได้ตี
 const m1=await pick(A);ok(m1,'A ต้องมีมอนให้ตี');await near(A,m1.uid);await near(B,m1.uid);await A.p.waitForTimeout(700);
 const b0=await snap(B);
 r.k1=await A.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(!m)return 'nomob';m.hp=1;let d=0;for(const [ox,oy] of [[30,6],[-30,6],[0,36],[0,-28]]){P.x=m.x+ox;P.y=m.y+oy;d=hurtE(m,1,{});if(m.dead)break}return m.dead?'killed':'alive dmg='+d},m1.uid);
 let b1=b0,peak=0;for(let i=0;i<8;i++){await B.p.waitForTimeout(120);b1=await snap(B);peak=Math.max(peak,b1.fx)}
 r.mirrorSaw={before:b0,after:b1,fxPeak:peak,mobGone:await B.p.evaluate(uid=>!D.mobs.some(q=>q.uid===uid&&!q.dead),m1.uid)};
 ok(r.k1==='killed','A ฆ่ามอนไม่ได้ ('+r.k1+')');ok(r.mirrorSaw.mobGone,'มอนต้องหายจากจอ B');ok(b1.splat>b0.splat&&peak>=b0.fx+8,'B (ไม่ได้ตี) ต้องเห็นเอฟเฟกต์ตาย+เสียง');
 // 2) คนดูฆ่า → โฮสต์ไม่ได้ตี
 await A.p.waitForTimeout(600);const m2=await pick(A);ok(m2,'ต้องมีมอนตัวที่สอง');await A.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m)m.hp=1},m2.uid);await near(A,m2.uid);await A.p.evaluate(()=>{P.x+=60});await B.p.waitForTimeout(500);
 const a0=await snap(A);
 r.k2=await B.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(!m)return 'nomob';let d=0;for(const [ox,oy] of [[30,6],[-30,6],[0,36],[0,-28]]){P.x=m.x+ox;P.y=m.y+oy;d=hurtE(m,1,{});if(d>0)break}return 'dmg='+d},m2.uid);
 let a1=a0,pk2=0;for(let i=0;i<10;i++){await A.p.waitForTimeout(120);a1=await snap(A);pk2=Math.max(pk2,a1.fx)}
 r.hostSaw={before:a0,after:a1,fxPeak:pk2,mobGoneA:await A.p.evaluate(uid=>!D.mobs.some(q=>q.uid===uid&&!q.dead),m2.uid),mobGoneB:await B.p.evaluate(uid=>!D.mobs.some(q=>q.uid===uid&&!q.dead),m2.uid)};
 ok(r.hostSaw.mobGoneA&&r.hostSaw.mobGoneB,'มอนตัวที่สองต้องตายทั้งสองจอ ('+r.k2+')');ok(a1.splat>a0.splat&&pk2>=a0.fx+8,'A (โฮสต์ ไม่ได้ตี) ต้องเห็นเอฟเฟกต์ตาย+เสียง');
 r.errs=[...A.errs,...B.errs].slice(0,6);ok(!r.errs.length,'มี error ในหน้าเกม');
 console.log(JSON.stringify(Object.assign(r,{fail}),null,1));await b.close();process.exit(0)})().catch(e=>{console.log('TESTERR',e&&e.stack||e);process.exit(1)});
