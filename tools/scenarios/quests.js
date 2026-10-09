// ทดสอบเควสทั้งหมดให้ทำจบได้ (ไม่ติด): เควสรอง s1–s10 (กลางวัน+กลางคืน) · เนื้อเรื่องพระราชาบท 0–13 · เควสกิลด์ทุกแบบ · ตำราช่าง 1–10 · เลือกอาชีพ
// ใช้: TOUCH=0 node tools/run-game.js game_built.html out 900 500 @tools/scenarios/quests.js  → ต้องได้ fail: []
const W=ms=>new Promise(r=>setTimeout(r,ms));const fail=[],ok=[];
const pick=re=>{const i=DLG.ch.findIndex(c=>re.test(c.t));if(i<0)return false;dlgPick(i);return true};
toTown();await W(700);P.lv=120;HOME.unlocked=1;
// ---- เควสรอง ----
for(const [ix,q] of SIDE.entries()){try{delete HOME.side[q.id];DAY.t=ix%2?23:10;await W(150);
 const n=D.npcs.find(o=>o.name===q.npc);if(!n){fail.push(q.id+' ไม่มี NPC '+q.npc);continue}
 P.x=n.x+24;P.y=n.y+6;dlgClose(true);npcTalk(n);if(!DLG.open||!pick(/รับเควส/)){fail.push(q.id+' รับเควสไม่ได้: '+DLG.txt.slice(0,40));continue}
 if(q.item)for(const k in q.item)inv[k]=(inv[k]|0)+q.item[k];if(q.kill){for(let i=0;i<q.kill.slime;i++)dropLoot(P.x,P.y,1)}if(q.dg)DG.max=Math.max(DG.max,q.dg+1);if(q.boss)STORY.boss[q.boss]=1;
 dlgClose(true);npcTalk(n);if(!pick(/ส่งเควส/)){fail.push(q.id+' ส่งเควสไม่ได้: '+DLG.txt.slice(0,50));continue}
 if(!(HOME.side[q.id]&&HOME.side[q.id].done))fail.push(q.id+' ไม่บันทึกว่าจบ');else ok.push(q.id+(ix%2?'(กลางคืน)':''))}catch(e){fail.push(q.id+' ERR '+e.message)}}
dlgClose(true);DAY.t=10;
// ---- เนื้อเรื่อง ----
const sv=D.owner;D.owner={name:'พระราชา',x:P.x,y:P.y,c:'#a33',h:'#ddd',hat:'crown',lines:['']};
STORY.ch=0;STORY.st='active';STORY.done=0;
for(let step=0;step<30&&STORY.ch<STCH.length-1;step++){const ch=STORY.ch;try{
 const c=STCH[ch];
 if(ch>0){if(ch===1)STORY.k.slime=(STORY.base.slime|0)+8;if(ch===2){P.lv=Math.max(P.lv,5)}
  if(ch===3&&P.cls==='none')P.cls='sword';if([4,8,11].includes(ch))DG.max=Math.max(DG.max,[0,0,0,0,5,0,0,0,25,0,0,50][ch]+1);
  if(ch===6)QST.done=(STORY.base.q|0)+3;if(ch===13){STORY.f100=1;DG.max=Math.max(DG.max,101)}
  const zb={5:'iron',7:'copper',9:'silver',10:'gold',12:'diamond'}[ch];if(zb)STORY.boss[zb]=1;
  if(STCH[ch].ch11){TW10.data.max=Math.max(TW10.data.max|0,12);STORY.mk11=1;STORY.wb11=1}
  if(ch===2){const n=chNeed();if(n[0]<n[1]){const sw=Object.keys(ITEMS).find(id=>ITEMS[id].tier>=1&&/sword|staff|bow/.test(ITEMS[id].kind||''));if(sw){GEAR[sw]=(GEAR[sw]|0)+1;try{equipItem(sw)}catch(e){}}}}
  storyTick();if(STORY.st!=='report'){fail.push('บท '+ch+' ทำครบแล้วแต่ไม่ขึ้นรายงาน need='+JSON.stringify(chNeed()));break}}
 dlgClose(true);kingTalk();for(let k=0;k<20&&DLG.open&&STORY.ch===ch;k++){if(!pick(/▶/))break}
 if(STORY.ch!==ch+1){fail.push('บท '+ch+' รายงานแล้วไม่ไปบทต่อ');break}ok.push('บท'+ch);dlgClose(true)}catch(e){fail.push('บท '+ch+' ERR '+e.message);break}}
D.owner=sv;dlgClose(true);
// ---- เควสกิลด์ ----
for(const t of QT){try{QST.act=[];const q={t:t[0],k:t[1],d:t[2],n:3,c:0,coin:10,xp:5,es:0};QST.act.push(q);const d0=QST.done;
 if(t[0]==='item')inv[t[1]]=(inv[t[1]]|0)+3;else if(t[0]==='kill'){for(let i=0;i<3;i++)questEv('kill',t[1])}else if(t[0]==='floor')questEv('floor',5);else for(let i=0;i<3;i++)questEv(t[0]);
 if(t[0]==='floor')q.n=3;qClaim(0);if(QST.done!==d0+1)fail.push('กิลด์ '+t[2]+' ส่งไม่ได้');else ok.push('กิลด์:'+t[2])}catch(e){fail.push('กิลด์ '+t[2]+' ERR '+e.message)}}
try{closeGuild()}catch(e){}
// ---- ตำราช่าง ----
const sv2=D.owner;D.owner={name:'ช่างหนวดเหล็ก',x:P.x,y:P.y,c:'#a33',h:'#ddd',lines:['']};SMITH.u=0;SMITH.q=0;P.lv=150;
for(let n=1;n<=10;n++){try{dlgClose(true);smithQuest();if(DLG.open)pick(/รับ/);dlgClose(true);for(const [k,v] of Object.entries(SMQ[n].need))inv[k]=(inv[k]|0)+v;smithQuest();if(DLG.open){const i=DLG.ch.findIndex(c=>c.c==='go');if(i>=0)dlgPick(i)}dlgClose(true);if(SMITH.u!==n){fail.push('ตำราช่าง '+n+' ไม่ปลดล็อก');break}ok.push('ช่าง'+n)}catch(e){fail.push('ตำราช่าง '+n+' ERR '+e.message);break}}
D.owner=sv2;dlgClose(true);
// ---- เลือกอาชีพ (กลางคืน: ปรมาจารย์ต้องไม่หลับ) ----
try{P.cls='none';P.lv=10;const m=D.npcs.find(o=>o.name==='ปรมาจารย์อาชีพ');DAY.t=23;await W(200);if(m.slp)fail.push('ปรมาจารย์หลับตอนกลางคืน');P.x=m.x+20;P.y=m.y+4;dlgClose(true);townAct();await W(50);if(DLG.open)pick(/เลือกอาชีพ/);
 if(!CM.open)fail.push('เปิดเมนูอาชีพไม่ได้');else{pickClass('sword');if(P.cls==='none')fail.push('เลือกอาชีพไม่ได้');else ok.push('อาชีพ:'+P.cls);try{closeClassMenu()}catch(e){}}}catch(e){fail.push('อาชีพ ERR '+e.message)}
// ---- หอคอย (บท 14/17): เข้า → ฆ่าบอส → นับชั้น ----
try{P.lv=120;TW10.data.max=0;enterTower10(1);await W(1800);if(!(D&&D.tower10))fail.push('เข้าหอคอยไม่ได้');else{let b=D.boss||D.mobs.find(q=>q.tower10);if(!b){await W(1500);b=D.boss||D.mobs.find(q=>q.tower10)}
 if(!b)fail.push('หอคอยไม่มีบอส');else{b.hp=0;mobKill(b);await W(200);if((TW10.data.max|0)<1)fail.push('ฆ่าบอสหอคอยแล้วไม่นับชั้น');else ok.push('หอคอยชั้น1')}}dlgClose(true);leaveTower10();await W(1500)}catch(e){fail.push('หอคอย ERR '+e.message)}
DAY.t=10;dlgClose(true);
return {fail,ok:ok.length,okList:ok.join(' ')}
