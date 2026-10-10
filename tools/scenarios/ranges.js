// วัดระยะจริงของทุกอาชีพ: ตีธรรมดา / สกิลทุกท่า (สกิล 3 จังหวะแยกจังหวะ) / อัลติ — ใช้หุ่น 27 ตัวเรียงทุก 24px บนแมพที่ลบกำแพงแล้ว
// ผล reach = ระยะหุ่นไกลสุดที่โดน (พิกเซล) · circle = รัศมี@ระยะจากตัว · shot = กระสุน:ระยะ (p=ทะลุ) · ใช้เวลา ~5 นาที
// node tools/run-game.js game_built.html ranges 1000 600 @tools/scenarios/ranges.js
try{for(const c in CSKILLS)CSK[c]=[1,1,1,1,1,1]}catch(e){} // v4.57 skill buy: สกิล 4–6 ต้องซื้อ — ในเทสให้ถือว่าเรียนแล้ว
const sl=ms=>new Promise(r=>setTimeout(r,ms));
P.lv=120;recalcStats();enterZone(NZI15.grove);await sl(2500);
const Zm=D.zone;for(const row of Zm.m)row.fill(FL);D.mobs.length=0;D.spT=1e9;D.bossT=1e9;
const X0=20*T,Y0=30*T;
const LOG={cur:null};
const mark=(k,v)=>{if(LOG.cur){(LOG.cur[k]=LOG.cur[k]||[]).push(v)}};
{const f=eachIn;eachIn=function(x,y,r,fn){mark('circle',Math.round(r)+'@'+Math.round(Math.hypot(x-P.x,y-(P.y-6))));return f.apply(this,arguments)};window.eachIn=eachIn}
{const f=shoot;shoot=function(k,o){mark('shot',k+':'+Math.round(o&&o.range||0)+(o&&o.pierce?'p':''));return f.apply(this,arguments)};window.shoot=shoot}
{const f=line25;line25=function(dv,len,w){mark('line',Math.round(len)+'x'+Math.round(w));return f.apply(this,arguments)}}
{const f=cone25;cone25=function(dv,r,a){mark('cone',Math.round(r));return f.apply(this,arguments)}}
{const f=hurtE;hurtE=function(e,m,o){const d=f.apply(this,arguments);if(d>0&&e.dd41!=null)mark('hit',e.dd41);return d}}
const dummies=[];
const mkD=()=>{D.mobs.length=0;dummies.length=0;for(let d=24;d<=648;d+=24){const m=mkMob('beetle','หุ่น',['#888','#444','#fff'],1,X0+d,Y0);m.hp=m.mhp=1e9;m.dd41=d;m.dummy=1;D.mobs.push(m);dummies.push(m)}};
const pin=setInterval(()=>{try{P.x=X0;P.y=Y0;P.dir='r';P.hp=BAL.hp;for(const m of dummies){if(m.hp<1e9-.5)mark('hit',m.dd41);m.x=X0+m.dd41;m.y=Y0;m.hp=1e9;m.dead=false;m.vx=m.vy=0;m.kx=m.ky=0;m.air=0}}catch(e){}},10);
const run=async(name,fn,wait)=>{mkD();P.mp=BAL.mp;P.stun=0;for(let i=0;i<CS.cd.length;i++)CS.cd[i]=0;LOG.cur={};await sl(30);try{fn()}catch(e){LOG.cur.err=e.message}await sl(wait||900);const r=LOG.cur;LOG.cur=null;
 const hits=r.hit||[];return {a:name,reach:hits.length?Math.max(...hits):0,n:new Set(hits).size,circle:[...new Set(r.circle||[])].slice(0,4),shot:[...new Set(r.shot||[])].slice(0,4),line:[...new Set(r.line||[])],cone:[...new Set(r.cone||[])],err:r.err}};
const OUT={};
for(const k of Object.keys(CLS).filter(c=>c!=='none')){P.cls=k;const kind=NEEDW[k];const wid=(typeof cwId27==='function'&&ITEMS[cwId27(k,3)])?cwId27(k,3):kind+3;GEAR[wid]=1;try{equipItem(wid)}catch(e){}P.armor.sword=wid;try{syncSword()}catch(e){}recalcStats();try{updSkBar()}catch(e){}
 const R=[];await sl(200);
 P.draw=true;P.tool='sword';P.atEnd=0;R.push(await run('ตีธรรมดา',()=>{P.at=-1;P.cmb=0;P.atEnd=0;attack()},900));
 const L=CSKILLS[k];for(let i=0;i<L.length;i++){if(L[i].steps){for(let s=0;s<3;s++){R.push(await run(L[i].n+' '+(s+1),()=>{if(s===0)CS.step=0;useSkill(i)},1000))}}else R.push(await run(L[i].n,()=>useSkill(i),i===2||i>=3?2600:1200))}
 R.push(await run('อัลติ',()=>{ULT.v=100;castUlt()},4200));
 OUT[k]={w:kind,res:R}}
clearInterval(pin);return OUT;
