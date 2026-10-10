// DPS ใน PvP ทุกอาชีพ (v4.65): ร่ายสกิล 1–6 วน + ตีธรรมดา 12 วิ ใส่ผู้เล่นปลอม (ระยะใกล้/ไกลตามอาชีพ) · นับดาเมจที่ส่ง {t:'pvp'}
// TOUCH=0 node tools/run-game.js game_built.html out 1000 600 @tools/scenarios/pvpdps.js   · window.SKILL=true → นับรายสกิลด้วย
try{for(const c in CSKILLS)CSK[c]=[1,1,1,1,1,1]}catch(e){}
const sl=ms=>new Promise(r=>setTimeout(r,ms));const LV=window.LV||100,TT=window.TT||7;P.lv=LV;enterZone(NZI15.grove);await sl(2500);for(const row of D.zone.m)row.fill(FL);D.mobs.length=0;D.spT=1e9;D.bossT=1e9;const X0=20*T,Y0=30*T;const out={},per={};
NET.on=true;NET.id=1;pvpOn8=()=>true;let sum=0,cur=-1;const by={};netSend=function(o){if(o&&o.t==='pvp'){sum+=o.dmg|0;if(cur>=0)by[cur]=(by[cur]||0)+(o.dmg|0)}};
const o={id:99,name:'เป้า',x:0,y:0,tx:0,ty:0,dir:'l',lv:LV,cls:'sword',pvp:true,dead:false,armor:{},tier:{}};NET.others.set(99,o);
for(const c of Object.keys(CLS).filter(k=>k!=='none')){P.cls=c;const w='cw_'+c+TT;GEAR[w]=1;P.armor.sword=ITEMS[w]?w:NEEDW[c]+TT;for(const s of ['helm','chest','pants','arm','neck','ring'])P.armor[s]=s+TT;try{syncSword()}catch(e){}recalcStats();
 MIN.length=0;const dist=isRng()?170:45;for(let k=0;k<6;k++)CS.cd[k]=0;P.mp=BAL.mp;sum=0;for(const k in by)delete by[k];
 const pin=setInterval(()=>{NET.on=true;if(!NET.others.has(99))NET.others.set(99,o);P.x=X0;P.y=Y0;P.dir="r";P.hp=BAL.hp;o.x=o.tx=X0+dist;o.y=o.ty=Y0;o.dead=false},10);await sl(300);
 const iv=setInterval(()=>{for(let i=5;i>=0;i--){if((CS.cd[i]||0)<=0&&P.mp>40){cur=i;try{useSkill(i)}catch(e){}break}}cur=-1;P.draw=true;P.tool='sword';cur=9;try{attack()}catch(e){}cur=-1},130);await sl(12000);clearInterval(iv);clearInterval(pin);await sl(300);
 out[c]=Math.round(sum/12.3);per[c]=Object.entries(by).map(([k,v])=>(k==9?'ตี':'s'+(+k+1))+':'+v).join(' ');MIN.length=0}
return window.SKILL?{out,per}:out
