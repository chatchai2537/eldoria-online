// ทดสอบ "คนที่ไม่ใช่โฮสต์ฟันธรรมดาต้องโดน" (v4.73 fix83): เปิดเซิร์ฟเวอร์ในตัว + 2 หน้าต่าง กดตีจริง (attack()) ไม่ใช่เรียก hurtE ตรง ๆ
//  1) ลานบอสโลก: คนดู (B) ทุกสายประชิด/ยิง ต้องทำดาเมจได้ และเซิร์ฟเวอร์นับให้ B   2) เหมือง: คนดูฟันมอน → เลือดมอนฝั่งโฮสต์ลด · ฟันตายแล้วได้เหรียญ
//  3) โฮสต์ฟันธรรมดาจนมอนตายตอนมีคนอื่นอยู่ → โฮสต์ต้องได้เหรียญ (เดิมไม่ได้เพราะไม่ถูกนับว่าตี)
// ใช้: NODE_PATH=$(npm root -g):/opt/npm-tools/node_modules node tools/melee-sync-test.js game_built.html
const os=require('os'),fs=require('fs'),path=require('path');
process.env.PORT=process.env.PORT||'8794';process.env.DATA_DIR=fs.mkdtempSync(path.join(os.tmpdir(),'mel'));process.env.WB_HP='3000000';
require('../server.js');const W=require('../world.js');const {chromium}=require('playwright');
(async()=>{const [,,file]=process.argv,srv='ws://localhost:'+process.env.PORT,fail=[],r={};const ok=(c,m)=>{if(!c)fail.push(m)};
 const b=await chromium.launch();
 const open=async(nm,lv)=>{const p=await (await b.newContext({viewport:{width:900,height:500}})).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(file)+'?devtest=1&server='+encodeURIComponent(srv));await p.waitForTimeout(4000);
  await p.evaluate(([nm,lv])=>{titleEl.hidden=true;PAUSED=false;STORY.intro=1;STORY.tut=99;TUT.on=false;P.name=nm;P.lv=lv;recalcStats();P.hp=BAL.hp;setInterval(()=>{if(!P.dead)P.hp=BAL.hp},60);netConnect()},[nm,lv]);return {p,errs}};
 const A=await open('ทดสอบเอ',60),B=await open('ทดสอบบี',60);await A.p.waitForTimeout(2500);
 // ---------- 1) ลานบอสโลก ----------
 W.wbSpawn('t@'+Date.now());await A.p.waitForTimeout(1500);
 await A.p.evaluate(()=>enterWb10());await A.p.waitForTimeout(3500);await B.p.evaluate(()=>enterWb10());await B.p.waitForTimeout(4500);
 r.modes=[await A.p.evaluate(()=>W33.mode),await B.p.evaluate(()=>W33.mode)];ok(r.modes[0]==='host'&&r.modes[1]==='mirror','ลานบอสโลก: A=host B=mirror (ได้ '+r.modes+')');
 await A.p.evaluate(()=>{P.x=D.zone.arena.x*32+520;P.y=D.zone.arena.y*32+330});
 const CLS=['none','sword','paladin','monk','ninja','dragoon','archer','mage','sniper','cleric','necro','summoner'];
 r.wbMirror=await B.p.evaluate(async(CLS)=>{const out={};
  for(const cls of CLS){const bo=D.boss;if(!bo){out[cls]='noboss';continue}
   if(cls!=='none'){P.cls=cls;try{const w=NEEDW[cls]+3;GEAR[w]=1;P.armor.sword=w;syncSword()}catch(e){out[cls]='equip '+e.message;continue}recalcStats()}
   const rng=typeof isRng==='function'&&isRng(),cx=D.zone.arena.x*32,log=[];
   for(let i=0;i<5;i++){const right=bo.x<cx,d=rng?150:30;P.x=bo.x+(right?d:-d);P.y=bo.y+8;P.dir=right?'l':'r';const h0=bo.hp;attack();await new Promise(q=>setTimeout(q,rng?1100:750));log.push(Math.round(h0-bo.hp))}
   out[cls]=(rng?'R ':'M ')+log.join(',')}return out},CLS);
 for(const c of CLS){const v=String(r.wbMirror[c]||''),hits=v.slice(2).split(',').filter(x=>+x>0).length;ok(hits>=2,'ลานบอสโลก: คนดูสาย '+c+' ตีธรรมดาต้องโดน (ได้ '+v+')')}
 await A.p.waitForTimeout(1500);r.wbDmg={};for(const k in W.S.wb.dmg)r.wbDmg[W.S.wb.dmg[k].n]=Math.round(W.S.wb.dmg[k].d);
 ok(r.wbDmg['ทดสอบบี']>0&&!r.wbDmg['ทดสอบเอ'],'เซิร์ฟเวอร์ต้องนับดาเมจให้ B เท่านั้น ('+JSON.stringify(r.wbDmg)+')');
 // ---------- 2) เหมือง: คนดูฟันมอนธรรมดา ----------
 for(const x of [A,B])await x.p.evaluate(()=>{P.cls='sword';try{const w=NEEDW.sword+3;GEAR[w]=1;P.armor.sword=w;syncSword()}catch(e){}recalcStats()});
 await A.p.evaluate(()=>{exitD();enterTown(1);setTimeout(()=>{exitD&&D&&exitD();enterZone(0)},700)});await A.p.waitForTimeout(4000);
 await B.p.evaluate(()=>{exitD();enterTown(1);setTimeout(()=>{exitD&&D&&exitD();enterZone(0)},700)});await B.p.waitForTimeout(5500);
 r.zModes=[await A.p.evaluate(()=>W33.mode+':'+netScene()),await B.p.evaluate(()=>W33.mode+':'+netScene())];ok(/^host:z:0/.test(r.zModes[0])&&/^mirror:z:0/.test(r.zModes[1]),'เหมือง: A=host B=mirror (ได้ '+r.zModes+')');
 const used=[];const pick=()=>A.p.evaluate((used)=>{const Zm=D.zone,far=(m)=>!(Zm.ores||[]).some(o=>o.alive!==false&&Math.hypot(o.x-m.x,o.y-m.y)<90)&&Math.hypot(Zm.ent.x*32-m.x,Zm.ent.y*32-m.y)>200;const m=D.mobs.filter(q=>!q.dead&&!q.boss&&q.uid&&!used.includes(q.uid)&&far(q)).sort((a,b)=>Math.hypot(a.x-P.x,a.y-P.y)-Math.hypot(b.x-P.x,b.y-P.y))[0];if(!m)return null;m.hp=m.max=5e6;return m.uid},used).then(u=>{if(u)used.push(u);return u});
 const swingAt=(x,uid,n)=>x.p.evaluate(async([uid,n])=>{const m=D.mobs.find(q=>q.uid===uid);if(!m)return 'nomob';const log=[];
   for(let i=0;i<n&&!m.dead;i++){let hit=0;for(const [ox,oy,dir] of [[-30,8,'r'],[30,8,'l']]){P.x=m.x+ox;P.y=m.y+oy;P.dir=dir;const h0=m.hp;attack();await new Promise(q=>setTimeout(q,750));hit=Math.round(h0-m.hp);if(hit>0||m.dead)break}log.push(hit)}return log.join(',')+(m.dead?' dead':'')},[uid,n]);
 const m1=await pick();ok(m1,'เหมือง: ต้องมีมอน');await B.p.waitForTimeout(400);await B.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m)m.hp=m.max=5e6},m1);await A.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);P.x=m.x+260;P.y=m.y},m1);
 const hostHp0=await A.p.evaluate(uid=>D.mobs.find(q=>q.uid===uid).hp,m1);r.zMirror=await swingAt(B,m1,4);await A.p.waitForTimeout(600);
 const hostHp1=await A.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);return m?m.hp:-1},m1);r.zHostSaw=Math.round(hostHp0-hostHp1);
 ok(/[1-9]/.test(r.zMirror),'เหมือง: คนดูฟันมอนต้องโดน (ได้ '+r.zMirror+')');ok(r.zHostSaw>0,'เหมือง: เลือดมอนฝั่งโฮสต์ต้องลดตามที่คนดูฟัน (ลด '+r.zHostSaw+')');
 // คนดูฟันตาย → ได้เหรียญ
 await A.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m)m.hp=1},m1);await B.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m)m.hp=1},m1);const bc0=await B.p.evaluate(()=>inv.coin);
 r.zMirrorKill=await swingAt(B,m1,4);await B.p.waitForTimeout(900);r.zMirrorCoin=(await B.p.evaluate(()=>inv.coin))-bc0;
 r.zGone=[await A.p.evaluate(uid=>!D.mobs.some(q=>q.uid===uid&&!q.dead),m1),await B.p.evaluate(uid=>!D.mobs.some(q=>q.uid===uid&&!q.dead),m1)];
 ok(r.zGone[0]&&r.zGone[1],'เหมือง: คนดูฟันมอนตาย มอนต้องหายทั้งสองจอ');ok(r.zMirrorCoin>0,'เหมือง: คนดูฟันมอนตายต้องได้เหรียญ (ได้ '+r.zMirrorCoin+')');
 // ---------- 3) โฮสต์ฟันธรรมดาตาย ตอนมีคนอื่นอยู่ ----------
 const m2=await pick();ok(m2,'เหมือง: ต้องมีมอนตัวที่สอง');await B.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m){P.x=m.x-260;P.y=m.y}},m2);
 await A.p.evaluate(uid=>{const m=D.mobs.find(q=>q.uid===uid);if(m)m.hp=1},m2);const ac0=await A.p.evaluate(()=>inv.coin);
 r.zHostKill=await swingAt(A,m2,4);await A.p.waitForTimeout(700);r.zHostCoin=(await A.p.evaluate(()=>inv.coin))-ac0;
 ok(/dead/.test(r.zHostKill),'เหมือง: โฮสต์ฟันมอนต้องตาย ('+r.zHostKill+')');ok(r.zHostCoin>0,'เหมือง: โฮสต์ฟันธรรมดาจนมอนตาย (มีคนอื่นอยู่) ต้องได้เหรียญ (ได้ '+r.zHostCoin+')');
 r.errs=[...A.errs,...B.errs].slice(0,6);ok(!r.errs.length,'มี error ในหน้าเกม');
 console.log(JSON.stringify(Object.assign(r,{fail}),null,1));await b.close();process.exit(0)})().catch(e=>{console.log('TESTERR',e&&e.stack||e);process.exit(1)});
