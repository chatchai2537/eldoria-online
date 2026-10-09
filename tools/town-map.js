// วาดแผนที่เมืองทั้งแผ่นเป็น town.png (ช่วยหาที่ว่างวางอาคาร) · node tools/town-map.js $(pwd)/game_built.html
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1000,height:700}});
await p.goto('file://'+process.argv[2]+'?devtest=1');await p.waitForTimeout(4000);
const r=await p.evaluate(()=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;
 const c=document.createElement('canvas');c.width=dcv.width;c.height=dcv.height;const k=c.getContext('2d');k.drawImage(dcv,0,0);
 for(let y=0;y<TH;y++)for(let x=0;x<TW;x++){const v=dm[y][x];if(v){k.fillStyle=v===1?'rgba(255,0,0,.35)':'rgba(0,0,255,.5)';k.fillRect(x*T,y*T,T,T)}}
 k.strokeStyle='rgba(255,255,255,.35)';k.font='10px sans-serif';k.fillStyle='#fff';for(let x=0;x<TW;x++){k.fillText(x,x*T+8,10)}for(let y=0;y<TH;y++)k.fillText(y,2,y*T+20);
 for(const n of D.npcs||[]){k.fillStyle='#ff0';k.beginPath();k.arc(n.x,n.y,6,0,7);k.fill()}
 return {url:c.toDataURL(),TW,TH,spawn:TOWN_SPAWN,doors:(D.doors||[]).length}});
const fs=require('fs');fs.writeFileSync('town.png',Buffer.from(r.url.split(',')[1],'base64'));console.log(JSON.stringify({TW:r.TW,TH:r.TH,spawn:r.spawn,doors:r.doors}));await b.close()})();
