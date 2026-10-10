// ภาพรวมแฟชั่น/อาวุธแฟชั่น/ไอเท็มเป็นแผ่นเดียว: node tools/fash-sheet.js game_built.html out.png "<prefix ชุด>" "<prefix อาวุธ>"
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,out,bp,wp]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:500}});
await p.goto('file://'+path.resolve(file)+'?devtest=1');await p.waitForTimeout(4000);
const u=await p.evaluate(async([bp,wp])=>{titleEl.hidden=true;PAUSED=false;toTown();await new Promise(r=>setTimeout(r,600));
 const L=[...Object.keys(OUTFIT).filter(k=>k.startsWith(bp)).map(k=>['body',k]),...Object.keys(FWPN).filter(k=>k.startsWith(wp)).map(k=>['w',k])];
 const cols=6,c=document.createElement('canvas');c.width=cols*150;c.height=Math.ceil(L.length/cols)*112;const k=c.getContext('2d');k.fillStyle='#000';k.fillRect(0,0,c.width,c.height);
 L.forEach(([kind,id],i)=>{let im=null;try{im=fashPreview(kind,id)}catch(e){}const x=(i%cols)*150,y=Math.floor(i/cols)*112;if(im)k.drawImage(im,x,y);k.fillStyle='#fff';k.font='11px sans-serif';k.fillText((kind==='body'?OUTFIT[id].n:FWPN[id].n).slice(0,22),x+3,y+108)});
 return c.toDataURL()},[bp||'c_',wp||'w_']);require('fs').writeFileSync(out,Buffer.from(u.split(',')[1],'base64'));await b.close()})();
