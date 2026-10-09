// ถ่ายภาพเมืองหลายจุด (ดูป้ายบัง/ทับกัน/NPC ทับบ้าน) · node tools/town-shots.js game_built.html <โฟลเดอร์ผลลัพธ์> [กลางคืน=1]
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,out,night]=process.argv;const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1280,height:720}});await p.goto('file://'+path.resolve(file)+'?devtest=1');await p.waitForTimeout(4000);
 const pts=await p.evaluate(async(night)=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;toTown();await new Promise(r=>setTimeout(r,800));DAY.t=night?23:10;
  const L=[];for(let y=8;y<TH;y+=12)for(let x=10;x<TW;x+=20)L.push([x,y]);return L},!!+night);
 for(const [x,y] of pts){await p.evaluate(([x,y])=>{P.x=x*T;P.y=y*T;GM7&&(GM7.god=true)},[x,y]);await p.waitForTimeout(500);await p.screenshot({path:out+'/town_'+x+'_'+y+'.png'})}
 console.log(pts.length+' shots');await b.close()})();
