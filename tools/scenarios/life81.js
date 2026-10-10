// ทดสอบ fix81 (v4.71): กล่องจดหมาย · โรงประมูลเห็นของ · ออกที่ประตูเดิม (หอคอย) · ที่ดินเข้า/ออกฝั่งซ้าย · ตลาดเดินเข้า/ออก · ล็อกจอ · ลากเล็งสกิล · ชาวเมืองกลางวัน/กลางคืน
// TOUCH=1 node tools/run-game.js game_built.html out 900 500 @tools/scenarios/life81.js   (ต้องได้ fail: [])
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),R={ok:[],fail:[]};const ok=(c,n,x)=>{(c?R.ok:R.fail).push(n+(x!==undefined?' '+JSON.stringify(x):''))};
const waitFor=async(f,ms=6000)=>{const t=performance.now();while(performance.now()-t<ms){try{if(f())return true}catch(e){}await sleep(60)}return false};
try{
 ok(window.FIX81===1,'patch loaded');
 // ---- ล็อกจอ
 ok(VH===448||VW===360,'fixed view',{VW,VH});
 // ---- จดหมาย
 openMail81();ok(!mbW81.hidden,'mail window opens');
 MB81.list=[{id:'a1',k:'auc',item:{k:'gear',id:'sword5',e:12},nm:'⚔️ ดาบเพชร +12',paid:50000,ts:Date.now()},{id:'a2',k:'coin',n:1234,why:'ถูกประมูลแซง',ts:Date.now()},{id:'a3',k:'auc',item:{k:'mount',id:'drake'},nm:'มังกร',paid:1,ts:Date.now()}];
 ON10.auth=true;const _ok=NET.on,_ws=NET.ws;NET.on=true;NET.ws={readyState:1,send(){}};renderMail81();ok(mbW81.querySelectorAll('.it').length===3,'mail rows',mbW81.querySelectorAll('.it').length);
 const g0=GEAR.sword5|0,c0=inv.coin;netMsg({t:'mgot',list:[MB81.list[0],MB81.list[1]]});ok((GEAR.sword5|0)===g0+1&&(ENH.sword5|0)>=12,'mgot gives gear');ok(inv.coin===c0+1234,'mgot gives coin');
 netMsg({t:'mbox',list:[MB81.list[2]],fresh:'a3'});ok(MB81.list.length===1,'mbox updates list');p6close(mbW81);
 ok(PM7.some(m=>m[3]==='mb81'),'profile menu has mailbox');
 // ---- โรงประมูล
 AUC10.lots=[{id:1,nm:'⚔️ ดาบเพชร +12',cur:50000,by:'',end:Date.now()+3600e3,bids:0,it:{k:'gear',id:'sword5',e:12}},{id:2,nm:'🐉 มังกรเวหาอเวจี (สัตว์ขี่บิน)',cur:60000,by:'x',end:Date.now()+3600e3,bids:1},{id:3,nm:'🗡️ อาวุธแฟชั่น มังกร',cur:1,by:'',end:Date.now()+999e3,bids:0}];
 p6open(aucW10);aucRender10();const pvs=[...aucW10.querySelectorAll('.au81 .pv')];ok(pvs.length===3&&pvs.every(p=>p.querySelector('img,canvas')),'auction previews',pvs.map(p=>p.innerHTML.slice(0,10)));
 aucView81(2);await sleep(50);const bx=[...document.body.children].find(e=>e.querySelector&&e.querySelector('.pv81'));ok(bx&&bx.querySelector('.pv81 canvas'),'auction detail view');if(bx)bx.remove();p6close(aucW10);
 NET.on=_ok;NET.ws=_ws;
 // ---- หอคอย: ออกที่ประตูหอ
 enterTown(1);await sleep(300);P.x=38.5*T;P.y=8*T+20;const tx=P.x,ty=P.y;P.lv=Math.max(P.lv,30);
 enterTower10(1);ok(await waitFor(()=>inTower10()),'enter tower');leaveTower10();ok(await waitFor(()=>D&&D.town&&!inTower10()),'leave tower');await sleep(200);
 ok(Math.hypot(P.x-tx,P.y-ty)<60,'tower exit at door',{dx:Math.round(P.x-tx),dy:Math.round(P.y-ty)});
 // ---- ที่ดิน: เดินขวาจากเมือง → โผล่ซ้าย · เดินซ้าย → ขอบขวาของเมือง
 HOME.unlocked=1;P.x=(TW-2.2)*T;P.y=16.5*T;exitD();ok(await waitFor(()=>D&&D.home),'town east → home');
 ok(P.x<3*T&&Math.abs(P.y/T-19.9)<1.2,'home arrive on left',{x:P.x/T,y:P.y/T});
 const Zm=ZCACHE[300];ok(Zm.m[19][0]===FL&&Zm.m[20][1]===FL,'home left gap open');
 D.g81t=0;P.x=.5*T;P.y=19.9*T;ok(await waitFor(()=>D&&D.town,5000),'home left → town');await sleep(300);ok(P.x>(TW-5)*T&&P.dir==='l','arrive town east',{x:P.x/T,y:P.y/T});
 // ---- ตลาด: เข้าโผล่ด้านบน · เดินขึ้นออก
 enterMk10();ok(await waitFor(()=>inMk10()),'enter market');await sleep(400);ok(P.y<4*T,'market arrive top',{y:P.y/T});
 ok(![...mkBar10.querySelectorAll('button')].some(b=>/กลับเมือง/.test(b.textContent)),'no back button');
 await sleep(1600);P.x=(D.zone.W/2)*T;P.y=1*T;ok(await waitFor(()=>D&&D.town&&!inMk10(),6000),'walk up leaves market');await sleep(400);ok(P.y>29*T&&P.y<33*T,'back at south gate',{x:P.x/T,y:P.y/T});
 // ---- ลากเล็งสกิล (จอสัมผัส): ฝนธนูตกที่จุดลาก
 enterTown(1);await sleep(200);exitD();await sleep(300);P.cls='archer';P.lv=80;GEAR.bow3=1;P.armor.sword='bow3';recalcStats();P.mp=999;CS.cd=[0,0,0,0,0,0];try{CSK.archer=[1,1,1,1,1,1]}catch(e){}
 aimHook81();const bi=barOf().indexOf(2);const b=SBTN[bi];ok(!!(b&&b.my81),'skill button wrapped',bi);
 if(b){PERS.length=0;const r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;const ev=(t,x,y)=>b.dispatchEvent(new PointerEvent(t,{pointerId:7,pointerType:'touch',clientX:x,clientY:y,bubbles:true,cancelable:true}));
  const px=P.x,py=P.y;ev('pointerdown',cx,cy);ev('pointermove',cx-100,cy);ok(AIM81.on===1,'aim shows while dragging');ev('pointerup',cx-100,cy);await sleep(50);
  const ar=PERS.find(o=>o.k==='arrowrain');ok(ar&&ar.x<px-150,'arrow rain lands at drag point',ar&&{dx:Math.round(ar.x-px),dy:Math.round(ar.y-py)});
  await sleep(1500);CS.cd=[0,0,0,0,0,0];P.mp=999;PERS.length=0;ev('pointerdown',cx,cy);ev('pointerup',cx,cy);await sleep(50);const a2=PERS.find(o=>o.k==='arrowrain');ok(!!a2,'tap still casts')}
 // ---- ชาวเมือง
 enterTown(1);await sleep(200);DAY.t=12;for(let i=0;i<5;i++){updNPCs(.05);await sleep(10)}
 const W=D.npcs.filter(n=>n.l81);ok(W.length>=12,'life npcs',W.length);ok(W.every(n=>!n.l81.hid),'day: everyone outside');
 for(const n of W){n.l81.wait=0}for(let i=0;i<200;i++)updNPCs(.1);const moved=W.filter(n=>Math.hypot(n.x-n.l81.post.x,n.y-n.l81.post.y)>40||n.l81.hid==='shop').length;ok(moved>=3,'day: npcs walk/enter shops',moved);
 DAY.t=22;for(let i=0;i<900;i++)updNPCs(.1);const hid=W.filter(n=>n.l81.hid==='home').length;ok(hid===W.length,'night: all home',{hid,all:W.length,left:W.filter(n=>!n.l81.hid).map(n=>n.name+'@'+Math.round(n.x/T)+','+Math.round(n.y/T))});
 ok(W.every(n=>n.x<0),'night: off street');
 const k=HOMES81.A,[hx,hy]=[k.x*T,k.y*T];P.x=hx;P.y=hy+6;P.dir='u';interact();await sleep(80);ok(DLG.open&&/เคาะประตู|ก๊อก/.test((gid('dlg')||document.body).textContent||''),'knock door dialog');try{dlgClose(true)}catch(e){}
 const nn=W.find(n=>n.l81.h==='A');npcTalk(nn);await sleep(50);ok(!nn.l81.hid&&nn.x>0,'talk brings npc out');try{dlgClose(true)}catch(e){}
 DAY.t=8;for(let i=0;i<600;i++)updNPCs(.1);ok(W.filter(n=>!n.l81.hid).length>=W.length-2,'morning: back outside',W.filter(n=>n.l81.hid).map(n=>n.name));
}catch(e){R.fail.push('EXC '+e.message+' '+(e.stack||'').slice(0,300))}
return {fail:R.fail,ok:R.ok.length,okList:R.ok};
