// ทดสอบ fix80 ฟาร์ม 3D: เปิดได้ (โหลด vendor/three.min.js) · สร้างฉากจากฟาร์มจริง · ปุ่มกลางคืน · แตะดูสถานะ · ปิดแล้วเกมเดินต่อ · ฟาร์มว่างก็เปิดได้
// ใช้: TOUCH=0 node tools/run-game.js game_built.html out 1280 800 @tools/scenarios/farm3d.js  → ต้องได้ fail: []
const W=ms=>new Promise(r=>setTimeout(r,ms));const fail=[],ok=[];const chk=(c,m)=>{if(c)ok.push(m);else fail.push(m)};
const wait3=async()=>{for(let i=0;i<80&&!(F3D79.stats);i++)await W(250);return F3D79.stats};
// 1) ฟาร์มว่าง
HOME.unlocked=1;HOME.house=0;HOME.builds=[];HOME.animals=[];HOME.tiles={};delete ZCACHE[300];enterHome();await W(600);
F3D79.stats=null;open3D79();let st=await wait3();chk(st&&st.meshes>0,'เปิด 3D ฟาร์มว่างได้');chk(PAUSED===true,'เกมหยุดระหว่างดู 3D');close3D79();await W(200);chk(!PAUSED&&gid('f3d79').hidden,'ปิดแล้วเกมเดินต่อ');
// 2) ฟาร์มเต็ม (ใช้ฟาร์มต้นแบบ fix78 + สัตว์ + ต้นไม้ผล)
HOME.house=4;HOME.tools.hamr=3;HOME.f77={xp:900,hv:0};inv.coin=1e7;inv.wood=999;inv.ingot=99;inv.ingSt=99;inv.hay=99;preset78(1);
for(const k in HOME.tiles){const L=Object.keys(CROPS);const [x,y]=k.split(',').map(Number);const ck=L[(x+y)%L.length];HOME.tiles[k].crop={k:ck,s:(x*3+y)%(CROPS[ck].d+1)}}
HOME.builds.push({k:'ft_apple',x:44,y:22,g:8,fd:9},{k:'ft_cherry',x:45,y:24,g:4},{k:'wmill77',x:41,y:18},{k:'hive77',x:20,y:20},{k:'lamp',x:23,y:20},{k:'barn',x:27,y:28},{k:'coop',x:6,y:28},{k:'sty',x:33,y:28},{k:'gazebo77',x:38,y:30});
for(const k of ['chicken','cow','sheep','duck','rabbit','goat','pig'])HOME.animals.push({k,x:30*32,y:33*32,hx:30*32,hy:33*32});homeObjects();
F3D79.stats=null;open3D79();st=await wait3();chk(st&&st.meshes>1000&&st.animals===7,'สร้างฉากฟาร์มเต็ม '+JSON.stringify(st));
const nb=gid('f3d79').querySelector('[data-a=night]');nb.click();await W(300);chk(gid('f3d79').classList.contains('night'),'ปุ่มกลางคืน');nb.click();await W(200);chk(!gid('f3d79').classList.contains('night'),'ปุ่มกลางวัน');
// แตะกลางจอ (ต้องไม่ error)
try{const cv=gid('f3d79').querySelector('canvas'),r=cv.getBoundingClientRect(),o={clientX:r.left+r.width/2,clientY:r.top+r.height/2,pointerId:1,bubbles:true};cv.dispatchEvent(new PointerEvent('pointerdown',o));cv.dispatchEvent(new PointerEvent('pointerup',o));ok.push('แตะได้')}catch(e){fail.push('แตะ ERR '+e.message)}
// ลากหมุน
const th0=F3D79.CAM.th;try{const cv=gid('f3d79').querySelector('canvas');cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:400,clientY:300,pointerId:2}));cv.dispatchEvent(new PointerEvent('pointermove',{clientX:500,clientY:300,pointerId:2}));cv.dispatchEvent(new PointerEvent('pointerup',{clientX:500,clientY:300,pointerId:2}))}catch(e){}chk(F3D79.CAM.th!==th0,'ลากหมุนกล้อง');
await W(800);gid('f3d79').querySelector('[data-a=x]').click();await W(200);chk(!PAUSED&&!F3D79.on,'ปุ่มปิด');
try{exitD();toTown()}catch(e){}
return {fail,ok:ok.length,okList:ok.join(' · ')}
