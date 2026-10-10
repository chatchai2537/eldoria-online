// fix84 (v4.74) — เจ้าของสั่ง (HANDOFF ข้อ 32 · ผู้เล่นแจ้ง): ต้นไม้พาสซีฟ "สายตรง" (คีย์สโตน) คุ้มกว่า "สายแยก 2 ทาง" ราว 2–3 เท่าต่อแต้ม
//  ปรับให้สมดุลแบบไม่ลดของใคร: จุดแรกของสายแยก (bL_/bR_) สเตตัส +3 → +5 · แก่นปลายสายแยก (N1_/N2_) แรงขึ้น ~1.3–1.5 เท่า
//  และแก่นที่เดิมไม่ช่วยตอนสู้เลยได้ผลต่อสู้เล็ก ๆ เพิ่ม · คีย์สโตนไม่แตะ (ยังแรงสุด) · วัดแล้วทั้งต้นของอาชีพแรงขึ้นรวมไม่เกิน ~8% ทุกอาชีพ
//  + บรรทัดอธิบายในหน้าต้นไม้ ให้ผู้เล่นเข้าใจว่าสายไหนคืออะไร
try{
const B84={
 sword:[{aspd:.13,dmg:.07},{area:.25,skill:.11}],
 paladin:[{hpr:.008,skill:.11},{dr:.07,cdr:.1}],
 dragoon:[{area:.25,skill:.1},{spd:.06,crit:.06,dmg:.04}],
 monk:[{crit:.07,dmg:.08},{hpr:.007,spd:.06,dr:.04}],
 ninja:[{spd:.06,crit:.06},{dmg:.11}],
 archer:[{crit:.07,skill:.07},{spd:.08,far:.3,dmg:.04}],
 sniper:[{skill:.15},{cdr:.12,crit:.03}],
 summoner:[{mdmg:.36},{mdur:.6,hp:.08}],
 necro:[{mdmg:.3,mpc:.12},{hpr:.007,mdur:.5,skill:.04}],
 mage:[{area:.25,skill:.05},{mpr:.5,mpc:.14,cdr:.04}],
 cleric:[{skill:.13,mpr:.4},{cdr:.12,hp:.09}]};
window.B84=B84;
for(const c in B84){
 for(const s of ['bL_','bR_']){const N=PNODES[s+c];if(!N||!N.st)continue;const k=Object.keys(N.st)[0];if(!k)continue;
  const o={};o[k]=5;N.st=o;N.n=String(N.n).replace(/\+\d+/,'+5');N.d=String(N.d).replace(/\+\d+/,'+5')}
 for(let i=1;i<=2;i++){const N=PNODES['N'+i+'_'+c];if(!N)continue;N.fx=B84[c][i-1];N.d=desc26(N.fx);try{if(NOT26[c])NOT26[c][i]=N.fx}catch(e){}}}
try{ptDirty()}catch(e){try{_ptx=null}catch(e2){}}
// คำอธิบายสั้น ๆ ในหน้าต้นไม้พาสซีฟ
{const _r=renderSkw;renderSkw=function(){const r=_r.apply(this,arguments);
  try{const card=skwEl.querySelector('.side .card');if(card&&card.querySelector('.pts')&&!card.querySelector('.h84')){const s=document.createElement('small');s.className='h84';s.style.cssText='display:block;margin-top:4px;color:#ffe9a8';
    s.textContent='📖 จากประตูอาชีพ: เส้นตรงกลาง = คีย์สโตนประจำอาชีพ (แรงสุด) · แยกซ้าย/ขวา = แก่นเสริมสกิล — เก็บได้ครบทุกทาง';card.appendChild(s)}}catch(e){}
  return r};window.renderSkw=renderSkw}
}catch(e){console.warn('fix84',e)}
