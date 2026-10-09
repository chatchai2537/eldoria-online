// ทดสอบลงดันเจี้ยนทีละชั้น: เข้า → ฆ่าบอส → ได้กุญแจ → เปิดกล่อง → กด E ลงชั้นถัดไป · ต้องได้ fail: []
// ใช้: TOUCH=0 node tools/run-game.js game_built.html out 900 500 @tools/scenarios/dungeon.js
const W=ms=>new Promise(r=>setTimeout(r,ms));const fail=[],ok=[];P.lv=150;try{recalcStats()}catch(e){}P.hp=P.max||P.hp;
const FL=[1,2,3,4,5,9,10,11,24,25,49,50,99,100,101,102,103,150,500,DGMAX7()-1,DGMAX7()];
for(const f of FL){try{DG.max=Math.max(DG.max,f);dgGo7(f);let t=0;while(!(D&&D.dg===f)&&t<40){await W(150);t++}
 if(!(D&&D.dg===f)){fail.push(f+': เข้าไม่ได้');continue}
 let b=null;for(let i=0;i<40&&!b;i++){b=D.boss||(D.mobs||[]).find(m=>m.boss&&!m.dead);if(!b)await W(150)}
 if(!b){fail.push(f+': ไม่มีบอส');continue}
 const k0=inv.dgkey|0;P.hp=P.max||9999;b.hp=0;mobKill(b);await W(300);
 if(!D.chest){fail.push(f+': ฆ่าบอสแล้วไม่มีกล่อง');continue}
 if(f<DGMAX7()&&(inv.dgkey|0)<=k0)fail.push(f+': ไม่ได้กุญแจ');
 P.x=D.chest.x;P.y=D.chest.y+20;DG.max=f;interact();await W(400);if(DLG.open)dlgClose(true);
 if(!D.chest.open){fail.push(f+': เปิดกล่องไม่ได้');continue}
 if(f<DGMAX7()){interact();let t2=0;while(!(D&&D.dg===f+1)&&t2<40){await W(150);t2++}if(!(D&&D.dg===f+1))fail.push(f+': ลงชั้น '+(f+1)+' ไม่ได้ (key='+(inv.dgkey|0)+')');else ok.push(f+'→'+(f+1))}
 else ok.push(f+' = ชั้นสุดท้าย')}catch(e){fail.push(f+' ERR '+e.message)}}
return {fail,ok:ok.join(' '),max:DGMAX7()}
