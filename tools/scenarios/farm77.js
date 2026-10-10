// ทดสอบ fix78+fix79 (v4.70 · ชื่อตัวแปรลงท้าย 77/78): ฟาร์มใหม่ (ต้นไม้ผล/รังผึ้ง/สัตว์ใหม่/ระดับฟาร์ม/ล็อก) + เนื้อเรื่องบท 18–26 + คู่มือ
// ใช้: TOUCH=0 node tools/run-game.js game_built.html out 900 500 @tools/scenarios/farm77.js  → ต้องได้ fail: []
const W=ms=>new Promise(r=>setTimeout(r,ms));const fail=[],ok=[];const chk=(c,m)=>{if(c)ok.push(m);else fail.push(m)};
HOME.unlocked=1;HOME.house=2;HOME.f77={xp:0,hv:0};HOME.builds=[{k:'coop',x:9,y:12},{k:'barn',x:29,y:11}];HOME.animals=[];HOME.tiles={};HOME.tools.hamr=3;
delete ZCACHE[300];enterHome();await W(800);
chk(flv77()===1,'ระดับฟาร์มเริ่ม 1');
// ล็อก: แตงโม (Lv.2) ซื้อเมล็ดไม่ได้ · พริก (Lv.1) ได้
inv.coin=1e6;const w0=inv.sd_watermelon|0;lifeBuy('sd_watermelon',45,1);chk((inv.sd_watermelon|0)===w0,'ล็อกเมล็ดแตงโมที่ Lv.1');
lifeBuy('sd_chili',18,1);chk(inv.sd_chili>=1,'ซื้อเมล็ดพริกได้');
startPlace('sty');chk(!PLACE.k,'ล็อกคอกหมูที่ Lv.1');
// ปลูก → รดน้ำ → วันใหม่ → เก็บเกี่ยว → XP
const X=20,Y=15;P.x=X*T+16;P.y=(Y+1)*T+10;P.dir='u';const [tx,ty]=target();HOME.tiles[tx+','+ty]={till:1};homePaintTile(tx,ty);plant(tx,ty,'chili');
chk(HOME.tiles[tx+','+ty].crop&&HOME.tiles[tx+','+ty].crop.k==='chili','ปลูกพริก');
for(let d=0;d<5;d++){HOME.tiles[tx+','+ty].w=HOME.day;HOME.day++;newDay()}
const c=HOME.tiles[tx+','+ty].crop;chk(c&&c.s>=CROPS.chili.d,'พริกโตครบ ('+(c&&c.s)+')');
inv.t_sick=1;P.draw=1;P.tool='sick';const h0=inv.chili|0,x0=HOME.f77.xp|0;homeUse();chk((inv.chili|0)>h0,'เก็บพริกได้');chk((HOME.f77.xp|0)>x0&&(HOME.f77.hv|0)>0,'ได้ XP/นับเก็บเกี่ยว');
chk(HOME.tiles[tx+','+ty].crop&&HOME.tiles[tx+','+ty].crop.s===CROPS.chili.d-CROPS.chili.re,'พริกเก็บซ้ำได้');
// ต้นไม้ผล: วาง → โต 8 วัน → ออกผล → เก็บ
HOME.builds.push({k:'ft_apple',x:14,y:16});homeObjects();for(let d=0;d<8+3;d++){HOME.day++;newDay()}
const tr=HOME.builds.find(b=>b.k==='ft_apple');chk(tr.g===8&&tr.fd>=3,'ต้นแอปเปิลโตแล้วออกผล g='+tr.g+' fd='+tr.fd);
P.x=14*T+16;P.y=17*T+4;P.draw=0;const a0=inv.fapple|0;dlgClose(true);homeAct();chk((inv.fapple|0)>a0&&tr.fd===0,'เก็บแอปเปิล');
// รังผึ้ง
HOME.builds.push({k:'hive77',x:27,y:20});homeObjects();P.x=27*T+16;P.y=21*T+4;const hn=inv.honey|0;homeAct();chk((inv.honey|0)>hn,'เก็บน้ำผึ้ง');const hn2=inv.honey|0;homeAct();chk((inv.honey|0)===hn2,'น้ำผึ้งรอ 2 วัน');
// ระดับฟาร์มขึ้น → ปลดล็อกเป็ด
HOME.f77.xp=29;fxp77(1);chk(flv77()>=2,'ฟาร์มขึ้น Lv.2');
const n0=HOME.animals.length;inv.coin=1e6;buyAnimal('duck');chk(HOME.animals.length===n0+1&&HOME.animals[n0].k==='duck','ซื้อเป็ดได้ที่ Lv.2');
buyAnimal('pig');chk(HOME.animals.length===n0+1,'ล็อกหมูที่ Lv.2');
const dk=HOME.animals[n0];inv.hay=5;P.x=dk.x;P.y=dk.y;dlgClose(true);homeAct();chk(dk.fed===HOME.day,'ป้อนเป็ด');HOME.day++;newDay();P.x=dk.x;P.y=dk.y;const e0=inv.degg|0;homeAct();chk((inv.degg|0)>e0,'เก็บไข่เป็ด');
// ขายของใหม่
openLife('sell');chk(!!lifeEl.querySelector('button[onclick*="degg"]'),'ขายไข่เป็ดในร้าน');closeLife();
// เซฟ/โหลด
saveHome();const sv=JSON.parse(localStorage.getItem('fm_home'));chk(sv.f77&&sv.f77.xp>0&&sv.builds.some(b=>b.k==='ft_apple'&&b.g===8),'เซฟฟาร์มใหม่');
// วาดทุกแบบไม่พัง
try{for(const k of Object.keys(CROPS))for(let s=0;s<=CROPS[k].d;s++)drawCrop({crop:{k,s},w:0},5,5);for(const k of Object.keys(BLD))drawBuild({k,x:3,y:3},{});for(const k of ['duck','rabbit','goat','pig','chicken','cow','sheep'])drawAnimal({k,x:100,y:100,vx:1,ph:0});ok.push('วาดครบ')}catch(e){fail.push('วาด ERR '+e.message)}
// เนื้อเรื่อง: บท 18–26 อยู่ก่อนบทอิสระ
const i18=STCH.findIndex(c=>c.ch77),fr=STCH.findIndex(c=>c.free);chk(i18===18&&fr===27,'บท 18–26 ต่อจากบท 17 (i18='+i18+' free='+fr+')');chk(!!STCH[fr].intro,'บทอิสระมีข้อความ');
// คู่มือ
openGuide66();const gb=gid('gb66');chk(gb&&/ตีบวกมีโอกาสแหก/.test(gb.innerHTML)&&/ประตูใต้/.test(gb.innerHTML)&&/👥 ปาร์ตี้/.test(gb.innerHTML)&&/ระดับฟาร์ม/.test(gb.innerHTML),'คู่มือใหม่');try{p6close(gb)}catch(e){}
// fix78 ฟาร์มต้นแบบ
try{HOME.builds=[];HOME.tiles={};homeObjects();inv.coin=1e7;inv.wood=999;inv.ingot=99;inv.ingSt=99;inv.hay=99;HOME.f77.xp=900;HOME.tools.hamr=3;preset78(1);chk(HOME.builds.length>100&&Object.keys(HOME.tiles).length>100,'จัดฟาร์มตามแบบ ('+HOME.builds.length+' ชิ้น)');for(const k of ['shed78','ghouse78','hut78','palm78','bush78','pond78','cpath78','wall78','brick78'])drawBuild({k,x:3,y:3},{})}catch(e){fail.push('preset78 ERR '+e.message)}
try{exitD();toTown()}catch(e){}
return {fail,ok:ok.length,okList:ok.join(' · ')}
