// ทดสอบออนไลน์ 2 หน้าต่างกับเซิร์ฟเวอร์ในเครื่อง: ตั้งปาร์ตี้ → A ร่ายสกิล (ช่วยเพื่อน/สกิลใหม่) → B ต้องเห็นเอฟเฟกต์ + ได้ฮีล/บัฟ
// รันเซิร์ฟเวอร์ก่อน: DATA_DIR=/tmp/sd PORT=8799 node server.js  แล้ว: node tools/online2.js game_built.html ws://localhost:8799
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,srv]=process.argv;const b=await chromium.launch();
 const open=async(nm)=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(nm=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;netConnect()},nm);return {p,errs}};
 const A=await open('ทดสอบเอ'),B=await open('ทดสอบบี');await A.p.waitForTimeout(3000);
 const st=async x=>x.p.evaluate(()=>({on:NET.on,id:NET.id,others:NET.others.size,sc:netScene()}));let r={a0:await st(A),b0:await st(B)};
 // ไปทุ่งเดียวกัน ยืนติดกัน
 for(const x of [A,B])await x.p.evaluate(()=>{toTown();setTimeout(()=>{exitD&&D&&exitD();enterZone(0)},500)});await A.p.waitForTimeout(4500);
 await A.p.evaluate(()=>{try{GM7.god=true}catch(e){}P.x=20*32;P.y=20*32;P.lv=120;P.cls='cleric';const w=NEEDW.cleric+3;GEAR[w]=1;P.armor.sword=w;try{syncSword()}catch(e){}recalcStats()});await B.p.evaluate(()=>{P.x=20*32+40;P.y=20*32;P.lv=120;recalcStats();P.hp=BAL.hp;try{GM7.god=true}catch(e){}});await A.p.waitForTimeout(1500);
 r.a1=await st(A);r.b1=await st(B);
 // ปาร์ตี้
 await A.p.evaluate(()=>netSend({t:'pinv',name:'ทดสอบบี'}));await A.p.waitForTimeout(800);const aid=await A.p.evaluate(()=>NET.id);await B.p.evaluate(id=>netSend({t:'pans',from:id,ok:1}),aid);await A.p.waitForTimeout(1500);
 r.party=await B.p.evaluate(()=>PTY35.mem.map(m=>m.name));
 // B เลือดเหลือครึ่ง → A ร่ายแสงรักษา (ช่อง 1) + ระฆัง (ช่อง 5)
 await B.p.evaluate(()=>{window.__hl=[];setInterval(()=>window.__hl.push(Math.round(P.hp)+(P.dead?'D':'')+':'+D.mobs.filter(m=>!m.dead&&Math.hypot(m.x-P.x,m.y-P.y)<200).length),300);P.hp=BAL.hp*.4;window.__h0=P.hp;window.__e0=(window.E46?E46.length:0)});
 await A.p.evaluate(()=>{window.__sup=[];const _n=netSend;netSend=function(o){if(o&&o.sup&&o.sup.length)window.__sup.push(...o.sup.map(s=>s.c));return _n(o)};P.mp=BAL.mp;for(let i=0;i<CS.cd.length;i++)CS.cd[i]=0;useSkill(0);setTimeout(()=>{P.mp=BAL.mp;useSkill(4)},1500)});await A.p.waitForTimeout(3500);
 r.heal=await B.p.evaluate(()=>({hp0:Math.round(window.__h0),hp:Math.round(P.hp),max:BAL.hp,reg:PB52.regU>performance.now(),e46:E46.filter(e=>e.rx52).length,bell:E46.some(e=>e.rx52&&e.bell)}));
 r.bLog=await B.p.evaluate(()=>window.__hl.join(' '));r.sentSup=await A.p.evaluate(()=>window.__sup);r.aState=await A.p.evaluate(()=>({cls:P.cls,mp:Math.round(P.mp),cd:CS.cd.map(v=>Math.round(v*10)/10),sc:netScene(),dead:P.dead,pt:PTY35.mem.length,others:NET.others.size}));r.errs=[...A.errs,...B.errs].slice(0,5);console.log(JSON.stringify(r,null,1));await b.close()})();
