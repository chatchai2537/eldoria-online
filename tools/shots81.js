// ภาพตรวจ fix81: node tools/shots81.js game_built.html <โฟลเดอร์>
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,out]=process.argv;const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:900,height:450},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(file)+'?devtest=1');await p.waitForTimeout(4000);
const ev=s=>p.evaluate(new Function('return (async()=>{'+s+'})()'));const shot=async n=>{await p.waitForTimeout(700);await p.screenshot({path:out+'/'+n+'.png'})};
await ev("titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;HOME.unlocked=1;enterTown(1)");await p.waitForTimeout(500);
await ev("P.x=(TW-2.2)*T;P.y=16.5*T;exitD()");await p.waitForTimeout(1500);await shot('1-home-left');
await ev("enterTown(1)");await p.waitForTimeout(800);await ev("enterMk10()");await p.waitForTimeout(1800);await shot('2-market-top');
await ev("leaveMk10()");await p.waitForTimeout(1800);await ev("if(!(D&&D.town))enterTown(1)");await p.waitForTimeout(600);await ev("DAY.t=12;P.x=22*T;P.y=19*T;for(const n of D.npcs)if(n.l81)n.l81.wait=0;for(let i=0;i<120;i++)updNPCs(.1)");await shot('3-town-day');
await ev("DAY.t=22.5;for(let i=0;i<900;i++)updNPCs(.1);P.x=8.5*T;P.y=9.5*T");await shot('4-town-night-houses');
await ev("P.x=5.5*T;P.y=7.8*T;P.dir='u';interact()");await shot('5-knock');
await ev("try{dlgClose(true)}catch(e){};DAY.t=12;ON10.auth=true;NET.on=true;NET.ws={readyState:1,send(){}};MB81.list=[{id:'a1',k:'auc',item:{k:'gear',id:'sword5',e:12},nm:'⚔️ ดาบเพชร +12',paid:50000,ts:Date.now()},{id:'a2',k:'coin',n:52500,why:'ถูกประมูลแซง: มังกร',ts:Date.now()},{id:'a3',k:'auc',item:{k:'mount',id:'drake'},nm:'🐉 มังกรเวหาอเวจี',paid:61000,ts:Date.now()},{id:'a4',k:'wbwin',rank:2,n:9,d:812000,gem:24,ts:Date.now()}];openMail81()");await shot('6-mailbox');
await ev("p6close(mbW81);AUC10.lots=[{id:1,nm:'⚔️ ดาบเพชร +12',cur:50000,by:'',end:Date.now()+3600e3,bids:0,it:{k:'gear',id:'sword5',e:12}},{id:2,nm:'🐉 มังกรเวหาอเวจี (สัตว์ขี่บิน)',cur:60000,by:'ผู้กล้า',end:Date.now()+5000e3,bids:3,it:{k:'mount',id:'drake'}},{id:3,nm:'🗡️ อาวุธแฟชั่น มังกร',cur:25000,by:'',end:Date.now()+999e3,bids:0,it:{k:'fash',id:'w:dragon'}}];openAuc10=openAuc10;p6open(aucW10);aucRender10()");await shot('7-auction');
await ev("p6close(aucW10);exitD();");await p.waitForTimeout(1200);await ev("P.cls='archer';P.lv=80;GEAR.bow3=1;P.armor.sword='bow3';recalcStats();aimHook81();AIM81.on=1;AIM81.dx=-.8;AIM81.dy=-.6;AIM81.f=.7");await shot('8-aim');
console.log(JSON.stringify(errs.slice(0,10)));await b.close()})();
