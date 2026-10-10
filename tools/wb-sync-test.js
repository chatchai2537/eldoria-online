// ทดสอบบอสโลกตัวเดียวกันทุกจอ (v4.72 fix82): เปิดเซิร์ฟเวอร์ในตัว + 2 หน้าต่าง → บอสตำแหน่งตรงกัน · ดาเมจแยกคน · สลับโฮสต์ · ตายพร้อมกัน
// ใช้: NODE_PATH=$(npm root -g):/opt/npm-tools/node_modules node tools/wb-sync-test.js game_built.html [โฟลเดอร์ภาพ]
const os=require('os'),fs=require('fs'),path=require('path');
process.env.PORT=process.env.PORT||'8797';process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'wbs'));process.env.WB_HP=process.env.WB_HP||'3000000';
require('../server.js');const W=require('../world.js');
const {chromium}=require('playwright');
(async()=>{const [,,file,shots]=process.argv,srv='ws://localhost:'+process.env.PORT,fail=[],r={};
 const ok=(c,msg)=>{if(!c)fail.push(msg)};
 const b=await chromium.launch();
 const open=async(nm,lv)=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' @ '+String(e.stack||'').split('\n').slice(1,5).map(l=>l.trim().replace(/file:\S+game_built\.html/,'')).join(' < ')));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(([nm,lv])=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;P.lv=lv;recalcStats();P.hp=BAL.hp;setInterval(()=>{if(!P.dead)P.hp=BAL.hp},60);netConnect()},[nm,lv]);return {p,errs,nm}};
 const A=await open('ทดสอบเอ',100),B=await open('ทดสอบบี',30);await A.p.waitForTimeout(2500);
 W.wbSpawn('test@'+Date.now());await A.p.waitForTimeout(1500);
 const st=x=>x.p.evaluate(()=>{const bo=D&&D.boss;return {sc:netScene(),mode:W33.mode,wb:WB82.mode,host:W33.host,id:NET.id,others:NET.others.size,on:WB10.on,
   boss:bo?{uid:bo.uid||0,x:Math.round(bo.x),y:Math.round(bo.y),hp:Math.round(bo.hp),max:bo.max,L:bo.L,atk:bo.atk,st:bo.st,loc:bo.loc82||0}:null,n:D&&D.mobs?D.mobs.filter(m=>!m.dead).length:0}});
 await A.p.evaluate(()=>enterWb10());await A.p.waitForTimeout(3500);r.aAlone=await st(A);
 ok(r.aAlone.sc==='wboss'&&r.aAlone.boss,'A เข้าลานแล้วต้องมีบอส');ok(r.aAlone.wb==='host','A อยู่คนเดียวต้องเป็นโฮสต์ (ได้ '+r.aAlone.wb+')');
 await B.p.evaluate(()=>enterWb10());await B.p.waitForTimeout(4500);r.a1=await st(A);r.b1=await st(B);
 ok(r.a1.wb==='host'&&r.b1.wb==='mirror','A=host B=mirror (ได้ '+r.a1.wb+'/'+r.b1.wb+')');
 ok(r.b1.boss&&r.a1.boss&&r.b1.boss.uid&&r.b1.boss.uid===r.a1.boss.uid,'B ต้องเห็นบอส uid เดียวกับ A');
 ok(r.b1.n===1&&r.a1.n===1,'ต้องมีบอสตัวเดียวในแต่ละจอ (A '+r.a1.n+' B '+r.b1.n+')');
 ok(r.b1.boss&&r.b1.boss.loc===r.b1.id&&r.b1.boss.L===38&&r.a1.boss.L===108,'ค่าพลังบอสคิดตามเลเวลแต่ละคน (A L'+(r.a1.boss&&r.a1.boss.L)+' B L'+(r.b1.boss&&r.b1.boss.L)+')');
 // ตำแหน่งบอสตรงกันระหว่างเคลื่อนที่: ให้ B ยืนไกล ๆ แล้ว A เดินล่อ
 await B.p.evaluate(()=>{P.x=D.zone.arena.x*32-420;P.y=D.zone.arena.y*32+330});await A.p.evaluate(()=>{const bo=D.boss;P.x=bo.x+150;P.y=bo.y+90});
 let maxD=0,moved=0,last=null;const smp=[];
 for(let i=0;i<14;i++){await A.p.evaluate(i=>{const cx=D.zone.arena.x*32,cy=D.zone.arena.y*32+60,a=i*.7;P.x=cx+Math.cos(a)*230;P.y=cy+Math.sin(a)*190},i);await A.p.waitForTimeout(400);const [a,bb]=await Promise.all([st(A),st(B)]);if(!a.boss||!bb.boss){fail.push('บอสหายระหว่างสุ่มตำแหน่ง รอบ '+i);break}
  const d=Math.hypot(a.boss.x-bb.boss.x,a.boss.y-bb.boss.y);maxD=Math.max(maxD,d);if(last)moved+=Math.hypot(a.boss.x-last.x,a.boss.y-last.y);last=a.boss;smp.push(a.boss.x+','+a.boss.y+'|'+bb.boss.x+','+bb.boss.y+'|'+a.boss.st)}
 r.pos={maxDiff:Math.round(maxD),hostMoved:Math.round(moved),smp:smp.slice(0,14)};
 ok(maxD<100,'ตำแหน่งบอสบนสองจอต่างกันมากสุด '+Math.round(maxD)+'px (ควร <100 · ช่วงบอสพุ่งจะตามหลัง ~60px)');ok(moved>30,'บอสควรขยับไล่ผู้เล่น (ขยับรวม '+Math.round(moved)+')');
 if(shots){fs.mkdirSync(shots,{recursive:true});await A.p.screenshot({path:path.join(shots,'wb-A-host.png')});await B.p.screenshot({path:path.join(shots,'wb-B-mirror.png')})}
 // ดาเมจ: B ตี → เซิร์ฟเวอร์นับให้ B เท่านั้น · A ตี → นับให้ A
 const hit=(x,n)=>x.p.evaluate(n=>{const bo=D.boss;if(!bo)return -1;let s=0;for(const [ox,oy] of [[-40,10],[40,10],[0,44],[0,-30]]){P.x=bo.x+ox;P.y=bo.y+oy;for(let i=0;i<n;i++){const h0=bo.hp;hurtE(bo,1,{});s+=Math.max(0,h0-bo.hp)}if(s>0)break}return Math.round(s)},n);
 const hp0=W.S.wb.hp;r.bHit=await hit(B,3);await A.p.waitForTimeout(1600);
 const dm=()=>{const o={};for(const k in W.S.wb.dmg)o[W.S.wb.dmg[k].n]=Math.round(W.S.wb.dmg[k].d);return o};r.dmgAfterB=dm();r.srvLoss1=Math.round(hp0-W.S.wb.hp);
 ok(r.bHit>0&&Math.abs(r.srvLoss1-r.bHit)<=3,'เซิร์ฟเวอร์ต้องหักเลือดเท่าที่ B ตี (B '+r.bHit+' เซิร์ฟเวอร์ '+r.srvLoss1+')');
 ok(!r.dmgAfterB['ทดสอบเอ'],'ดาเมจของ B ต้องไม่ไปนับให้ A (โฮสต์)');
 const hp1=W.S.wb.hp;r.aHit=await hit(A,3);await A.p.waitForTimeout(1600);r.dmgAfterA=dm();r.srvLoss2=Math.round(hp1-W.S.wb.hp);
 ok(r.aHit>0&&Math.abs(r.srvLoss2-r.aHit)<=3,'เซิร์ฟเวอร์ต้องหักเลือดเท่าที่ A ตี (A '+r.aHit+' เซิร์ฟเวอร์ '+r.srvLoss2+')');
 r.a2=await st(A);r.b2=await st(B);
 ok(Math.abs(r.a2.boss.hp-W.S.wb.hp)<=r.aHit+5&&Math.abs(r.b2.boss.hp-W.S.wb.hp)<=r.bHit+5,'เลือดบอสบนสองจอต้องตรงกับเซิร์ฟเวอร์ (A '+r.a2.boss.hp+' B '+r.b2.boss.hp+' srv '+Math.round(W.S.wb.hp)+')');
 // บอสตีคนดู: ดาเมจที่ B โดนต้องเป็นสัดส่วนเลเวล B (ไม่ใช่พลังบอสเลเวล A)
 await B.p.evaluate(()=>{window.__hits=[];const _z=zHurt;zHurt=function(s,d){window.__hits.push(Math.round(d));return _z.apply(this,arguments)}});
 await A.p.evaluate(()=>{P.x=D.zone.arena.x*32+500;P.y=D.zone.arena.y*32+300});await B.p.evaluate(()=>{const bo=D.boss;P.x=bo.x+30;P.y=bo.y+20});
 for(let i=0;i<16;i++){await B.p.waitForTimeout(500);await B.p.evaluate(()=>{const bo=D.boss;if(bo&&Math.hypot(P.x-bo.x,P.y-bo.y)>140){P.x=bo.x+30;P.y=bo.y+20}})}
 r.bTook=await B.p.evaluate(()=>window.__hits.slice(0,8));r.atk={A:r.a2.boss.atk,B:r.b2.boss.atk};
 ok(r.bTook.length>0,'บอส (คุมโดย A) ต้องตี B ได้');if(r.bTook.length)ok(Math.max.apply(null,r.bTook)<r.a2.boss.atk*1.2,'ดาเมจที่ B โดนต้องปรับตามเลเวล B (สูงสุด '+Math.max.apply(null,r.bTook)+' · พลังบอสฝั่ง A '+r.a2.boss.atk+' ฝั่ง B '+r.b2.boss.atk+')');
 r.dead={A:await A.p.evaluate(()=>!!P.dead),B:await B.p.evaluate(()=>!!P.dead)};ok(!r.dead.A&&!r.dead.B,'ตัวทดสอบต้องไม่ตาย (เซิร์ฟเวอร์ไม่นับดาเมจของคนตาย)');
 // สลับโฮสต์: A ออก → B คุมต่อ บอสตัวเดิมตำแหน่งเดิม
 const before=await st(B);await A.p.evaluate(()=>{exitD();enterTown(1)});await A.p.waitForTimeout(2500);r.b3=await st(B);r.a3=await st(A);
 ok(r.b3.wb==='host','A ออกแล้ว B ต้องเป็นโฮสต์ (ได้ '+r.b3.wb+')');ok(r.b3.boss&&r.b3.boss.uid===before.boss.uid&&r.b3.n===1,'B ต้องคุมบอสตัวเดิมต่อ (ไม่เกิดตัวใหม่)');
 await A.p.evaluate(()=>enterWb10());await A.p.waitForTimeout(4500);r.a4=await st(A);r.b4=await st(B);
 ok(r.a4.wb==='mirror'&&r.a4.boss&&r.b4.boss&&r.a4.boss.uid===r.b4.boss.uid&&r.a4.n===1,'A กลับเข้ามาต้องเป็นคนดูและเห็นบอสตัวเดียวกับ B');
 // ตาย: เซิร์ฟเวอร์ยืนยัน → ตายพร้อมกันทุกจอ + ได้รางวัลทั้งคู่
 for(const x of [A,B])await x.p.evaluate(()=>{window.__win=0;window.__fx0=fx.length;const _w=wbWin10;wbWin10=function(d){window.__win=d.rank;return _w.apply(this,arguments)}});
 ok(r.a4.boss&&r.a4.boss.L===108&&r.b4.boss.L===38,'กลับเข้ามาแล้วค่าพลังบอสต้องคิดตามเลเวลตัวเอง (A L'+(r.a4.boss&&r.a4.boss.L)+')');
 // โฮสต์ค้าง (จำลอง: B หยุดเกมเหมือนพับจอ/เปิดเมนูค้าง) → A ต้องได้เป็นโฮสต์แทนภายใน ~5 วิ และบอสตัวเดิมเดินต่อ
 const uidH=r.b4.boss&&r.b4.boss.uid;await B.p.evaluate(()=>{PAUSED=true});await A.p.waitForTimeout(5500);r.a5=await st(A);
 ok(r.a5.wb==='host'&&r.a5.boss&&r.a5.boss.uid===uidH&&r.a5.n===1,'โฮสต์ค้าง → A ต้องรับช่วงคุมบอสตัวเดิม (ได้ '+r.a5.wb+')');
 await B.p.evaluate(()=>{PAUSED=false});await A.p.waitForTimeout(2500);r.b5=await st(B);
 ok(r.b5.wb==='mirror'&&r.b5.boss&&r.b5.boss.uid===uidH&&r.b5.n===1,'B กลับมาแล้วต้องเป็นคนดู เห็นบอสตัวเดิม (ได้ '+r.b5.wb+')');
 // ปิดฉากแบบตีทีละที (เลือดเหลือน้อย ซิงก์แล้ว) — บอสต้องตายได้ ไม่ค้างที่ 1 HP
 W.S.wb.hp=300;await A.p.waitForTimeout(1400);r.killHits=[];for(let i=0;i<14&&W.S.wb.on;i++){r.killHits.push(await hit(A,1)+'>'+Math.round(W.S.wb.hp));await A.p.waitForTimeout(450)}r.srvAfterKillHit=Math.round(W.S.wb.hp);await A.p.waitForTimeout(2500);
 const end=x=>x.p.evaluate(()=>({boss:!!(D&&D.boss),alive:D&&D.mobs?D.mobs.filter(m=>!m.dead).length:0,killed:WB10.killed,on:WB10.on,win:window.__win,sc:netScene()}));r.aEnd=await end(A);r.bEnd=await end(B);
 ok(!r.aEnd.boss&&!r.bEnd.boss&&r.aEnd.alive===0&&r.bEnd.alive===0,'บอสต้องตายทั้งสองจอ');ok(r.aEnd.win>0&&r.bEnd.win>0,'ทั้งสองคนต้องได้รางวัล (อันดับ A '+r.aEnd.win+' B '+r.bEnd.win+')');
 ok(W.S.lots.length===3&&W.S.lots.every(l=>Math.abs(l.end-Date.now()-10*60e3)<8000),'ของประมูล 3 ชิ้น ต้องหมดเวลาใน 10 นาที');
 if(shots){await A.p.screenshot({path:path.join(shots,'wb-A-dead.png')});await B.p.screenshot({path:path.join(shots,'wb-B-dead.png')})}
 r.errs=[...A.errs,...B.errs].slice(0,6);ok(!r.errs.length,'มี error ในหน้าเกม');
 console.log(JSON.stringify(Object.assign(r,{fail}),null,1));await b.close();process.exit(0)})().catch(e=>{console.log('TESTERR',e&&e.stack||e);process.exit(1)});
