// fix83 (v4.73) — เจ้าของแจ้ง 2026-10-11 00:31
//  A) "เพื่อนในห้องบอสโลกตีธรรมดาไม่โดน": การฟันธรรมดาสายประชิด (ดาบ/นักดาบ/พาลาดิน/นักพรต/นินจา) คิดอยู่ท้าย updMob ตัวเดิม
//     แต่โหมดคนดูของ fix33 (W33 mirror) ข้าม updMob ตัวเดิมทั้งก้อน → คนที่ไม่ใช่โฮสต์ฟันมอนไม่โดนเลย (เป็นมาตั้งแต่ v4.38 ในเหมือง/ดันเจี้ยน
//     และเริ่มเป็นในลานบอสโลกตั้งแต่ v4.72 ที่บอสโลกใช้ระบบโฮสต์) — สายยิง/ทวน/สกิลไม่เป็น เพราะใช้ hurtE
//     แก้: คนดูคิด "โดนฟัน" เอง (สูตร/ระยะ/ตัวคูณ fix51 เดียวกับตัวเดิม) แล้วส่งดาเมจให้โฮสต์ (md) เหมือนสกิล
//     + โฮสต์ที่ฟันธรรมดา: บันทึกว่า "เราตี" (my33) ด้วย — เดิมไม่บันทึก ทำให้โฮสต์ฟันมอนตายตอนมีคนอื่นอยู่ในฉากแล้วไม่ได้ของ/XP
//  B) ร้านสัตว์: รูปตัวอย่างสัตว์ขี่/สัตว์เลี้ยง (ยกเว้นม้า/หมาป่า/หมา/แมว) ตกไปวาดเป็นแกะ (drawAnimal ไม่รู้จัก) → วาดตัวจริงด้วย drawSteed / drawPet
try{
// ---------- A) ฟันธรรมดาในโหมดคนดู + เครดิตของโฮสต์ ----------
const M83={cur:null,l0:0,h0:0};window.M83=M83;
function swing83(m){ // เงื่อนไขและสูตรเดียวกับบล็อก "โดนฟัน" ใน updMob ตัวเดิม (+ตัวคูณสายประชิด MEL51 ของ fix51)
 const F=m.F,SPN=P.cmb===2&&P.tool==='sword',ax=SPN?P.x:P.x+DIRV[P.dir][0]*26,ay=SPN?P.y-14:P.y-8+DIRV[P.dir][1]*26,
  atk=P.tool==='sword'&&!(typeof isRng!=='undefined'&&isRng())&&(SPN?(P.at>.12&&P.at<.88):(P.at>.2&&P.at<.7));
 if(!(atk&&m.last!==atkId&&Math.hypot(m.x-ax,(m.y-10*m.sc)-ay)<(SPN?50:34)+F.r*m.sc*.6))return;
 m.last=atkId;const cr=Math.random()<.08+P.stats.agi*.004;
 let dmg=Math.max(1,Math.round(ATK()*rnd(.9,1.1)*(cr?1.8+(window.CRITD?CRITD():0):1)*(SPN?1.15:1)));
 const k=window.MEL51&&MEL51[P.cls];if(k)dmg=Math.round(dmg*k);
 m.hp-=dmg;m.hurt=.18;sfx('hit');dmgTxt(m.x+rnd(-6,6),m.y-26*m.sc,(cr?'💥':'')+dmg,cr?'#ffd84a':'#fff',cr);
 for(let i=0;i<5;i++)fx.push({x:m.x,y:m.y-10*m.sc,vx:(Math.random()-.5)*120,vy:-30-Math.random()*60,l:.35,c:'255,255,255'});
 m.my33=(m.my33||0)+dmg;netSend({t:'sx',k:'md',to:W33.host,uid:m.uid,dmg:dmg,cr:cr?1:0,stun:0});
 if(m.hp<=0)mobKill(m)}
{const _um=updMob;updMob=function(m,dt){
  if(!m||!m.uid)return _um.apply(this,arguments);
  const sv=M83.cur,svl=M83.l0,svh=M83.h0;M83.cur=m;M83.l0=m.last;M83.h0=m.hp;let r;
  try{r=_um.apply(this,arguments)}finally{
   try{if(!m.dead&&D&&D.zone){
     if(W33.mode==='mirror'){if(m.F)swing83(m)}
     else if(W33.mode==='host'&&M83.l0!==atkId&&m.last===atkId&&m.hp<M83.h0)m.my33=(m.my33||0)+(M83.h0-m.hp)}}catch(e){}
   M83.cur=sv;M83.l0=svl;M83.h0=svh}
  return r};window.updMob=updMob}
// โฮสต์ฟันทีเดียวตาย: mobKill ถูกเรียกจากใน updMob ก่อนเราจะได้บันทึก → บันทึกตรงนี้ (เฉพาะเมื่อดาบเพิ่งโดนตัวนี้ในเฟรมนี้จริง)
{const _mk=mobKill;mobKill=function(m){
  try{if(m&&m.uid&&M83.cur===m&&W33.mode==='host'&&M83.l0!==atkId&&m.last===atkId&&!(m.my33>0))m.my33=Math.max(1,M83.h0)}catch(e){}
  return _mk.apply(this,arguments)};window.mobKill=mobKill}

// ---------- B) รูปตัวอย่างในร้านสัตว์ ----------
{const _t=thumbCv;thumbCv=function(k,v){
  try{if(k==='a'&&!['dog','cat','horse','wolf'].includes(v)){const a=ANIMS.find(q=>q.k===v);
    if(a&&a.mount&&typeof drawSteed==='function'){const big=typeof MOUNTS!=='undefined'&&MOUNTS[v]&&MOUNTS[v].fly;
     return thumb(()=>{ctx.translate(0,big?-8:-2);drawSteed(v,0,0,1,false)},140,74,big?.62:.75)}
    if(a&&a.pet)return thumb(()=>{drawPet({k:v},0,0)},140,74,1.6)}}catch(e){}
  return _t.apply(this,arguments)};window.thumbCv=thumbCv}
}catch(e){console.warn('fix83',e)}
