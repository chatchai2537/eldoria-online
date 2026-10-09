// ทดสอบสกิลช่อง 4–6 ของทุกอาชีพ: ร่ายได้ไหม · โดนหุ่นกี่ตัว ไกลแค่ไหน · มีไอคอน · มีพาสซีฟ 3 ขั้น · มีสมุนเกิด
// node tools/run-game.js game_built.html newsk 1000 600 @tools/scenarios/new-skills.js   (~4 นาที)
const sl=ms=>new Promise(r=>setTimeout(r,ms));P.lv=120;recalcStats();enterZone(NZI15.grove);await sl(2500);
const Zm=D.zone;for(const row of Zm.m)row.fill(FL);D.mobs.length=0;D.spT=1e9;D.bossT=1e9;const X0=20*T,Y0=30*T;
const dummies=[];const hits=new Set();
const mkD=()=>{D.mobs.length=0;dummies.length=0;for(let d=24;d<=648;d+=24){const m=mkMob('beetle','หุ่น',['#888','#444','#fff'],1,X0+d,Y0);m.hp=m.mhp=1e9;m.dd=d;D.mobs.push(m);dummies.push(m)}};
const pin=setInterval(()=>{try{P.x=X0;P.y=Y0;P.dir='r';P.hp=BAL.hp;for(const m of dummies){if(m.hp<1e9-.5)hits.add(m.dd);m.x=X0+m.dd;m.y=Y0;m.hp=1e9;m.dead=false;m.vx=m.vy=0;m.kx=m.ky=0}}catch(e){}},10);
const OUT={};
for(const k of Object.keys(CLS).filter(c=>c!=='none')){P.cls=k;const wid=NEEDW[k]+3;GEAR[wid]=1;P.armor.sword=wid;try{syncSword()}catch(e){}recalcStats();try{updSkBar()}catch(e){}
 const L=CSKILLS[k],res=[];
 for(let i=3;i<L.length;i++){mkD();MIN.length=0;hits.clear();P.mp=BAL.mp;P.stun=0;for(let j=0;j<CS.cd.length;j++)CS.cd[j]=0;const mp0=P.mp;await sl(50);
  let err=null;try{useSkill(i);if(k==='ninja'&&i===3){await sl(300);useSkill(i)}}catch(e){err=e.message}
  await sl(i===5?3200:2600);res.push({n:L[i].n,cast:P.mp<mp0||CS.cd[i]>0,cd:+CS.cd[i].toFixed(1),hit:hits.size,reach:hits.size?Math.max(...hits):0,min:MIN.length,icon:!!SKART[L[i].n],err})}
 OUT[k]={n:L.length,pas:(PASSIVE[k]||[]).filter(p=>p.sk41).map(p=>p.lv+':'+p.n),bar:barOf().length,res}}
clearInterval(pin);return OUT;
