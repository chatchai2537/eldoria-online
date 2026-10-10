// ทดสอบบอสตำนาน 6 ตัว: เข้าลาน → บอสเกิด (เลือด) → วงเตือนทำงาน → ฆ่า → ได้ตรา → แลกชิ้นเซ็ต · ถ่ายภาพแต่ละลาน
// node tools/lboss.js game_built.html <โฟลเดอร์ภาพ>
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,outd]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:620}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(file)+'?devtest=1');await p.waitForTimeout(4000);await p.evaluate(()=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;toTown();P.lv=150;recalcStats();inv.coin=1e7;try{GM7.god=true}catch(e){}window.zHurt=zHurt=function(){};});
const out=[];for(let i=0;i<6;i++){await p.evaluate(i=>{if(in62())leave62();},i);await p.waitForTimeout(1500);await p.evaluate(i=>{toTown();enter62(i)},i);await p.waitForTimeout(2600);
 const r=await p.evaluate(async i=>{const b=D&&D.boss;if(!b)return {i,err:'no boss',sc:netScene()};P.x=b.x;P.y=b.y+120;b.aggro=1;D.cyc=.1;await new Promise(r=>setTimeout(r,1400));const aoe=window.AOE62.length;return {i,name:b.nm,hp:b.max,atk:b.atk,lv:b.L,aoe,sc:netScene(),paused:PAUSED,el:D.el,cyc:D.cyc,dlg:DLG.open}},i);
 await p.screenshot({path:outd+'/lb'+i+'.png'});
 const k=await p.evaluate(async i=>{const b=D.boss;const m0=inv['lbm'+i]|0;b.hp=0;mobKill(b);await new Promise(r=>setTimeout(r,1200));const got=(inv['lbm'+i]|0)-m0;if(DLG.open)dlgClose(true);return {got,won:D.won}},i);out.push(Object.assign(r,k))}
const ex=await p.evaluate(()=>{inv.lbm3=10;const g0=GEAR.chest14|0;openAltar62();pickPiece62(3);const i=DLG.ch.findIndex(c=>/เสื้อเกราะ/.test(c.t));DLG.ch[i].f();return {exch:(GEAR.chest14|0)-g0,left:inv.lbm3}});
console.log(JSON.stringify({out,ex,errs:errs.slice(0,5)},null,1));await b.close()})();
