// เปิดเกมแบบ headless (Playwright + Chromium) ข้ามล็อกอิน (?devtest=1) รันสคริปต์ทดสอบ แล้วถ่ายภาพหน้าจอ
// ใช้: node tools/run-game.js <ไฟล์เกม.html> <ชื่อภาพ> [กว้าง สูง] [สคริปต์ หรือ @ไฟล์สคริปต์]
//   env: TOUCH=0 = จอคอม (ค่าเริ่ม = มือถือ/แตะได้) · WAIT=ms รอก่อนถ่ายภาพ (ค่าเริ่ม 800)
// สคริปต์รันในหน้าเกมแบบ async function: ใช้ await ได้ และ return ค่าที่อยากดู (พิมพ์ออกเป็น JSON)
// ตัวอย่าง: TOUCH=0 node tools/run-game.js game_built.html out 1280 720 @tools/scenarios/validator.js
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
(async()=>{let [,,file,out,w='844',h='390',setup='']=process.argv;if(setup.startsWith('@'))setup=fs.readFileSync(setup.slice(1),'utf8');
 const b=await chromium.launch();const touch=process.env.TOUCH!=='0';const ctx=await b.newContext({viewport:{width:+w,height:+h},hasTouch:touch,isMobile:touch,deviceScaleFactor:1});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,200))});
 await p.goto('file://'+path.resolve(file)+'?devtest=1');await p.waitForTimeout(4000);
 const r=await p.evaluate(async(setup)=>{try{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false}catch(e){}
  try{return await (new Function('return (async()=>{'+setup+'\n})()'))()}catch(e){return 'SETUPERR '+e.message+' '+e.stack}},setup);
 await p.waitForTimeout(+(process.env.WAIT||800));await p.screenshot({path:out+'.png'});console.log(JSON.stringify(r,null,1));if(errs.length)console.log(errs.slice(0,15).join('\n'));await b.close()})();
