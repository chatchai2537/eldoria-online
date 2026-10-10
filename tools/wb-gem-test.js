// ทดสอบแจก 💠 บอสโลก (v4.64): รวมไม่เกิน 100 · คนละ 10–30 · ตามดาเมจ — node tools/wb-gem-test.js
const os=require('os'),fs=require('fs'),path=require('path');process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'wb'));
const W=require('../world.js');const got={},sent=[];const H={players:new Map(),send:(p,m)=>sent.push(m),broadcast:()=>{},clean:s=>s,num:(v,a,b)=>Math.max(a,Math.min(b,+v||0)),ACC:{gemAdd:(l,n)=>{got[l]=(got[l]||0)+n},mailAdd:async()=>{},verify:async()=>null,mailTake:async()=>[],guildOf:async()=>null}};
W.init(H);const fail=[];
for(const [label,dmgs] of [['15 คนเท่ากัน',Array(15).fill(1000)],['5 คนไม่เท่ากัน',[5000,3000,1000,500,100]],['คนเดียว',[9999]]]){for(const k in got)delete got[k];
 W.S.wb={on:true,hp:1,max:1,end:Date.now()+1e6,dmg:{}};dmgs.forEach((d,i)=>W.S.wb.dmg['a'+i]={n:'p'+i,d,acct:'a'+i,id:0});W.wbKill();
 const v=Object.values(got),tot=v.reduce((a,b)=>a+b,0);console.log(label,JSON.stringify(got),'รวม',tot);if(tot>100||v.some(x=>x<10||x>30))fail.push(label)}
console.log(JSON.stringify({fail}));process.exit(0);
