// fix86 (v4.76) — เจ้าของแจ้ง (HANDOFF ข้อ 33): "ขี่สัตว์แล้วมองไม่เห็นเพื่อน เหมือนมีอะไรบัง"
//  สาเหตุ: ตัวห่อ hero รุ่นเก่า (บรรทัด ~4663) วาดผู้เล่นคนอื่น "ข้างใน" ตัวห่อท่าขี่สัตว์/ท่านั่ง ซึ่งเลื่อนภาพขึ้นและตัดขอบ (clip)
//   เป็นกรอบแคบ ๆ รอบตัวเรา (ขี่ 140×128px · นั่ง 120×118px) → ตอนเราขี่สัตว์หรือนั่งพัก เพื่อนที่อยู่ห่างเกิน ~60–70px ถูกตัดหายทั้งตัว
//   ส่วนคนที่ยืนใกล้ถูกวาดลอยขึ้น ~30px (สัตว์บินยิ่งลอย) — เป็นทุกแมพ ไม่ใช่แค่ป่า
//  แก้: ตอนขี่สัตว์/นั่ง ให้วาดผู้เล่นคนอื่นที่ชั้นนอกสุด (ก่อน/หลังตัวเราตามลำดับ y เหมือนเดิม) แล้วซ่อนรายชื่อจากตัวห่อข้างในชั่วคราว
try{
const EMPTY86=new Map();
{const _h=hero;hero=function(){
  let clip=false;try{clip=!window.__IN_OTHER8&&!P.dead&&NET.others&&NET.others.size>0&&((typeof MOUNT!=='undefined'&&MOUNT.on&&!!HOME.mount)||!!P.sit)}catch(e){}
  if(!clip)return _h.apply(this,arguments);
  const real=NET.others,L=Array.from(real.values()),py=P.y;
  for(const o of L)if(o.y<py){try{drawOther(o)}catch(e){}}
  NET.others=EMPTY86;try{_h.apply(this,arguments)}finally{NET.others=real}
  for(const o of L)if(o.y>=py){try{drawOther(o)}catch(e){}}};window.hero=hero}
}catch(e){console.warn('fix86',e)}
