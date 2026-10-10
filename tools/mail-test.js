// ทดสอบกล่องจดหมาย/โรงประมูลฝั่งเซิร์ฟเวอร์ (v4.71) แบบไม่ต่อเน็ต: node tools/mail-test.js  → fail: []
const os=require('os'),fs=require('fs'),path=require('path');const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mt-'));process.env.DATA_DIR=dir;delete process.env.UPSTASH_REDIS_REST_URL;
const ACC=require('../accounts');const fail=[],ok=[];const t=(c,n,x)=>(c?ok:fail).push(n+(x!==undefined?' '+JSON.stringify(x):''));
(async()=>{const r=await ACC.handle('/api/register',{id:'tester1',pw:'secret12',name:'Tester'},'1.1.1.1');t(r.ok,'register');
 const a=await ACC.mailAdd('tester1',{k:'auc',item:{k:'gear',id:'sword5',e:12},nm:'ดาบ',paid:5});const b=await ACC.mailAdd('tester1',{k:'coin',n:100});t(a&&a.id&&b&&b.id,'mailAdd ids');
 let L=await ACC.mailList('tester1');t(L.length===2,'list 2');const g=await ACC.mailClaim('tester1',[a.id]);t(g.length===1&&g[0].k==='auc','claim one');
 L=await ACC.mailList('tester1');t(L.length===1&&L[0].id===b.id,'one left');const g2=await ACC.mailClaim('tester1',[a.id]);t(g2.length===0,'no double claim');
 const g3=await ACC.mailClaim('tester1','all');t(g3.length===1,'claim all');t((await ACC.mailList('tester1')).length===0,'empty');
 // world: deliver → mailbox + แจ้ง mbox ให้คนออนไลน์
 const W=require('../world');const sent=[];const players=new Map([[1,{id:1,acct:'tester1',joined:true,ws:{readyState:1,send(){}}}]]);
 W.init({players,send:(p,m)=>sent.push(m),broadcast:()=>{},ACC,clean:(s,n)=>String(s||'').slice(0,n),num:(v,a,b)=>Math.max(a,Math.min(b,+v||0))});
 W.onMsg(players.get(1),{t:'abid',id:999,amt:1},Date.now());await new Promise(r=>setTimeout(r,50));
 // ส่งของผ่าน mclaim/mlist
 await ACC.mailAdd('tester1',{k:'coin',n:7});W.onMsg(players.get(1),{t:'mlist'},Date.now());await new Promise(r=>setTimeout(r,80));
 t(sent.some(m=>m.t==='mbox'&&m.list.length===1),'mlist → mbox');const id=sent.filter(m=>m.t==='mbox').pop().list[0].id;
 W.onMsg(players.get(1),{t:'mclaim',ids:[id]},Date.now());await new Promise(r=>setTimeout(r,80));t(sent.some(m=>m.t==='mgot'&&m.list.length===1&&m.list[0].n===7),'mclaim → mgot');
 // kv
 await ACC.kvSet('eld:world',{lots:[{id:5,nm:'x'}],nextLot:6,t:Date.now()});const j=await ACC.kvGet('eld:world');t(j&&j.lots.length===1,'kv roundtrip');
 console.log(JSON.stringify({fail,ok:ok.length}));process.exit(0)})().catch(e=>{console.log('EXC',e);process.exit(1)});
