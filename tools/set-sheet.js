// ภาพรวมเซ็ต (ไอคอน 9 ชิ้น + ตัวละครใส่ครบ หน้า/ข้าง) — node tools/set-sheet.js game_built.html out.png <tier เริ่ม> <จำนวน>
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,out,t0,n]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:500}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(file)+'?devtest=1');await p.waitForTimeout(4000);
const u=await p.evaluate(async([t0,n])=>{titleEl.hidden=true;PAUSED=false;toTown();await new Promise(r=>setTimeout(r,600));const K=['sword','staff','bow','helm','chest','pants','arm','neck','ring'];
 const c=document.createElement('canvas');c.width=9*56+2*120;c.height=n*120;const k=c.getContext('2d');k.fillStyle='#1a1428';k.fillRect(0,0,c.width,c.height);
 const load=src=>new Promise(r=>{const im=new Image();im.onload=()=>r(im);im.onerror=()=>r(null);im.src=src});
 for(let i=0;i<n;i++){const t=t0+i,y=i*120;for(let j=0;j<9;j++){const im=await load(iconURL('item:'+K[j]+t));if(im)k.drawImage(im,j*56+2,y+30,52,52)}
  k.fillStyle=(RARE12[t]||['',  '#fff'])[1];k.font='bold 14px sans-serif';k.fillText(TNAMES[t]+' ['+(RARE12[t]||[''])[0]+']',4,y+18);
  for(const [vi,dir] of [[0,'d'],[1,'r']]){const cv=document.createElement('canvas');cv.width=120;cv.height=120;const sv=ctx,sa=Object.assign({},P.armor),st=Object.assign({},P.tier),sx=P.x,sy=P.y,sd=P.dir,sm=P.mv;ctx=cv.getContext('2d');
   try{P.armor.helm='helm'+t;P.armor.chest='chest'+t;P.armor.pants='pants'+t;P.armor.arm='arm'+t;P.armor.sword='sword'+t;P.tier.sword=t;ctx.translate(60,108);ctx.scale(1.7,1.7);P.x=0;P.y=0;P.dir=dir;P.mv=false;P.draw=true;P.tool='sword';hero()}catch(e){}finally{ctx=sv;Object.assign(P.armor,sa);Object.assign(P.tier,st);P.x=sx;P.y=sy;P.dir=sd;P.mv=sm}
   k.drawImage(cv,9*56+vi*120,y)}}
 return c.toDataURL()},[+t0,+n]);require('fs').writeFileSync(out,Buffer.from(u.split(',')[1],'base64'));if(errs.length)console.log(errs.slice(0,5).join('\n'));await b.close()})();
