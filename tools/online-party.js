// ทดสอบปาร์ตี้/ผู้คนออนไลน์ (v4.64): A เห็นรายชื่อ B (who) · ชวน B เข้าปาร์ตี้ · โอนหัวหน้าให้ B · B เตะ A
// รันเซิร์ฟเวอร์ก่อน: DATA_DIR=/tmp/sd PORT=8799 node server.js  แล้ว: node tools/online-party.js game_built.html ws://localhost:8799
const {chromium}=require('playwright'),path=require('path');(async()=>{const [,,file,srv]=process.argv;const b=await chromium.launch();
 const open=async(nm)=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(nm=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;netConnect()},nm);return {p,errs}};
 const A=await open('หัวหน้าเอ'),B=await open('ลูกทีมบี');await A.p.waitForTimeout(3000);const r={};
 await A.p.evaluate(()=>openPeople72('on'));await A.p.waitForTimeout(1500);r.who=await A.p.evaluate(()=>(W72.who||[]).map(p=>p.name));
 await A.p.evaluate(()=>ptyInvite35('ลูกทีมบี'));await A.p.waitForTimeout(800);const aid=await A.p.evaluate(()=>NET.id),bid=await B.p.evaluate(()=>NET.id);
 await B.p.evaluate(id=>netSend({t:'pans',from:id,ok:1}),aid);await A.p.waitForTimeout(1500);r.party=await B.p.evaluate(()=>({n:PTY35.mem.length,lead:PTY35.lead}));
 await A.p.evaluate(id=>{openParty72();ptyLead72(id)},bid);await A.p.waitForTimeout(1500);r.lead=await A.p.evaluate(()=>PTY35.lead);r.bid=bid;
 await B.p.evaluate(id=>ptyKick35(id),aid);await A.p.waitForTimeout(1500);r.after=await A.p.evaluate(()=>PTY35.mem.length);
 r.errs=[...A.errs,...B.errs].slice(0,5);console.log(JSON.stringify(r,null,1));await b.close()})();
