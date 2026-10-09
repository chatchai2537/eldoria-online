// ทดสอบเดินทางแมพป่าใหม่ ไป-กลับ (ทุ่งหญ้า→ป่าละเมาะ→ลำธาร→ป่าสน→ป่าหมอก แล้วย้อน) + เช็กว่าประตูเดินถึงได้
P.lv=45;recalcStats();const sl=ms=>new Promise(r=>setTimeout(r,ms));const o={steps:[]};const st=()=>({sc:netScene(),id:D&&D.zone&&D.zone.Zd.id,W:ZW,H:ZH,px:Math.round(P.x/T),py:Math.round(P.y/T),ores:D&&D.zone?D.zone.ores.length:0,mobs:D&&D.mobs?D.mobs.length:0});
const e=EX16.L.find(q=>q.dir==='w');o.exId=e.id;ex16Go(e);await sl(2500);o.steps.push(st());
for(const id of ['creek','pine','mist']){const Z=D.zone;P.x=Z.gate42.x;P.y=Z.gate42.y;interact();await sl(2600);o.steps.push(st())}
// back from mist to pine
{const Z=D.zone;P.x=Z.ent.x*T+16;P.y=(Z.ent.y+2)*T+16;o.lbl=dgExitLbl11();interact();await sl(2600);o.steps.push(st())}
// back pine->creek
{const Z=D.zone;P.x=Z.ent.x*T+16;P.y=(Z.ent.y+2)*T+16;interact();await sl(2600);o.steps.push(st())}
o.hitAtArrive=hit(P.x,P.y);
// reachability: gate reachable from ent in each big zone
o.reach={};for(const id of ['grove','creek','pine']){const Zm=genZone(NZI15[id]);const gx=Math.floor((Zm.gate42.x)/T),gy=Math.floor(Zm.gate42.y/T);o.reach[id]=[!!Zm.seen[gy*Zm.W+gx],Zm.ores.length,Zm.floor.length]}
return o
