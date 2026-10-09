// icons41 — ไอคอนสกิลใหม่ช่อง 4–6 แบบสมจริง (วาดด้วย canvas · ใช้กับ SKART ได้ทันที)
// ทุกฟังก์ชันรับ (q,S) แบบเดียวกับ SKART เดิม · พิกัดออกแบบบนกริด 96×96 แล้วสเกลตาม S
const I41=(()=>{
const TAU=Math.PI*2;
const rng=s=>()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};
const hash=t=>{let h=7;for(const c of t)h=(h*31+c.charCodeAt(0))%2147483647;return h||1};
const add=(q,f)=>{q.save();q.globalCompositeOperation='lighter';f();q.restore()};
function glow(q,x,y,r,rgb,a){const g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a??.9})`);g.addColorStop(.35,`rgba(${rgb},${(a??.9)*.45})`);g.addColorStop(1,`rgba(${rgb},0)`);q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}
// พื้นหลัง: ไล่สี + ควันซ้อนชั้น + เม็ดพื้นผิว + ขอบมืด
function bg(q,c1,c2,smoke,seed){const R=rng(seed);const g=q.createRadialGradient(46,40,4,48,50,72);g.addColorStop(0,c1);g.addColorStop(1,c2);q.fillStyle=g;q.fillRect(0,0,96,96);
 for(let i=0;i<9;i++){const x=R()*96,y=R()*96,r=18+R()*30;const s=q.createRadialGradient(x,y,0,x,y,r);s.addColorStop(0,`rgba(${smoke},${.10+R()*.12})`);s.addColorStop(1,`rgba(${smoke},0)`);q.fillStyle=s;q.fillRect(x-r,y-r,r*2,r*2)}
 for(let i=0;i<260;i++){const v=R();q.fillStyle=v>.5?`rgba(255,255,255,${R()*.05})`:`rgba(0,0,0,${R()*.09})`;q.fillRect(R()*96,R()*96,1,1)}}
function vignette(q){const v=q.createRadialGradient(48,46,30,48,48,70);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.62)');q.fillStyle=v;q.fillRect(0,0,96,96)}
// กรอบโลหะทองแบบนูน
function frame(q,tint){const g=q.createLinearGradient(0,0,96,96);g.addColorStop(0,'#fff3c0');g.addColorStop(.25,tint||'#d9a640');g.addColorStop(.5,'#6a4612');g.addColorStop(.75,tint||'#d9a640');g.addColorStop(1,'#3a2408');
 q.lineWidth=5;q.strokeStyle=g;q.strokeRect(2.5,2.5,91,91);q.lineWidth=1;q.strokeStyle='rgba(0,0,0,.75)';q.strokeRect(5.5,5.5,85,85);q.strokeStyle='rgba(255,240,200,.35)';q.strokeRect(.5,.5,95,95);
 for(const [x,y] of [[2.5,2.5],[93.5,2.5],[2.5,93.5],[93.5,93.5]]){const r=q.createRadialGradient(x-1,y-1,0,x,y,5);r.addColorStop(0,'#fff8d8');r.addColorStop(1,'#7a5214');q.fillStyle=r;q.beginPath();q.arc(x,y,4,0,TAU);q.fill()}}
function finish(q,tint){vignette(q);const s=q.createLinearGradient(0,0,0,96);s.addColorStop(0,'rgba(255,255,255,.16)');s.addColorStop(.35,'rgba(255,255,255,0)');s.addColorStop(1,'rgba(0,0,0,.18)');q.fillStyle=s;q.fillRect(0,0,96,96);frame(q,tint)}
function sparks(q,seed,n,x,y,r,rgb){const R=rng(seed);add(q,()=>{for(let i=0;i<n;i++){const a=R()*TAU,d=R()*r,s=.6+R()*1.6;q.fillStyle=`rgba(${rgb},${.4+R()*.6})`;q.beginPath();q.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,s,0,TAU);q.fill()}})}
function streaks(q,seed,n,x,y,r0,r1,rgb,w){const R=rng(seed);add(q,()=>{for(let i=0;i<n;i++){const a=R()*TAU,a0=r0+R()*8,a1=r1*(.7+R()*.3);q.strokeStyle=`rgba(${rgb},${.25+R()*.5})`;q.lineWidth=(w||1.4)*(.5+R());q.beginPath();q.moveTo(x+Math.cos(a)*a0,y+Math.sin(a)*a0);q.lineTo(x+Math.cos(a)*a1,y+Math.sin(a)*a1);q.stroke()}})}
// ดาบโลหะ: ร่องเลือด ขอบคม ไฮไลต์
function blade(q,x,y,ang,L,W,o={}){q.save();q.translate(x,y);q.rotate(ang);W=W||5;
 const g=q.createLinearGradient(-W,0,W,0);g.addColorStop(0,o.d||'#4a5468');g.addColorStop(.45,o.c||'#e8eef8');g.addColorStop(.55,o.c2||'#aab6c8');g.addColorStop(1,o.d||'#3a4254');
 q.fillStyle=g;q.strokeStyle='rgba(10,12,20,.9)';q.lineWidth=1.2;q.beginPath();q.moveTo(-W,0);q.lineTo(-W*.9,-L*.8);q.lineTo(0,-L);q.lineTo(W*.9,-L*.8);q.lineTo(W,0);q.closePath();q.fill();q.stroke();
 q.strokeStyle='rgba(30,36,50,.6)';q.lineWidth=1;q.beginPath();q.moveTo(0,-2);q.lineTo(0,-L*.72);q.stroke();
 add(q,()=>{q.strokeStyle=o.edge||'rgba(255,255,255,.85)';q.lineWidth=.9;q.beginPath();q.moveTo(-W*.85,-1);q.lineTo(-W*.75,-L*.8);q.lineTo(0,-L+1);q.stroke()});
 if(!o.noHilt){const h=q.createLinearGradient(-W*2.6,0,W*2.6,0);h.addColorStop(0,'#5a3a0e');h.addColorStop(.5,o.h||'#ffd870');h.addColorStop(1,'#5a3a0e');q.fillStyle=h;q.strokeStyle='#1a1006';q.beginPath();q.moveTo(-W*2.6,-1);q.quadraticCurveTo(0,-4,W*2.6,-1);q.lineTo(W*2.4,3);q.quadraticCurveTo(0,1,-W*2.4,3);q.closePath();q.fill();q.stroke();
  q.fillStyle='#3a2210';q.fillRect(-W*.55,3,W*1.1,L*.24);q.strokeStyle='rgba(255,220,160,.35)';for(let i=0;i<4;i++){q.beginPath();q.moveTo(-W*.55,5+i*L*.055);q.lineTo(W*.55,7+i*L*.055);q.stroke()}
  q.fillStyle=o.h||'#ffd870';q.beginPath();q.arc(0,4+L*.26,W*.7,0,TAU);q.fill();q.stroke()}
 q.restore()}
// คลื่นกระแทกวงรี
function shock(q,x,y,rx,ry,rgb,n){add(q,()=>{for(let i=0;i<(n||3);i++){const k=1-i*.28;q.strokeStyle=`rgba(${rgb},${.85*k})`;q.lineWidth=3.2*k;q.beginPath();q.ellipse(x,y,rx*(1-i*.22),ry*(1-i*.22),0,0,TAU);q.stroke()}});glow(q,x,y,rx*.8,rgb,.35)}
function rocks(q,seed,n,x,y,w,col){const R=rng(seed);for(let i=0;i<n;i++){const px=x+(R()-.5)*w,py=y-R()*w*.35,s=1.5+R()*3.5;q.fillStyle=col||'#5a4636';q.strokeStyle='rgba(0,0,0,.6)';q.lineWidth=.8;q.beginPath();q.moveTo(px-s,py);q.lineTo(px-s*.3,py-s);q.lineTo(px+s,py-s*.4);q.lineTo(px+s*.6,py+s*.6);q.closePath();q.fill();q.stroke()}}
// ผลึกน้ำแข็งเหลี่ยม
function crystal(q,x,y,h,w,ang){q.save();q.translate(x,y);q.rotate(ang||0);const g=q.createLinearGradient(-w,0,w,0);g.addColorStop(0,'rgba(120,190,255,.95)');g.addColorStop(.5,'rgba(235,250,255,.98)');g.addColorStop(1,'rgba(70,130,220,.95)');
 q.fillStyle=g;q.strokeStyle='rgba(20,60,120,.8)';q.lineWidth=.9;q.beginPath();q.moveTo(0,-h);q.lineTo(w,-h*.55);q.lineTo(w*.8,0);q.lineTo(-w*.8,0);q.lineTo(-w,-h*.55);q.closePath();q.fill();q.stroke();
 q.strokeStyle='rgba(255,255,255,.75)';q.beginPath();q.moveTo(0,-h);q.lineTo(-w*.2,0);q.moveTo(-w,-h*.55);q.lineTo(0,-h*.45);q.lineTo(w,-h*.55);q.stroke();q.restore()}
function beam(q,x1,y1,x2,y2,w,rgb,core){add(q,()=>{for(const [k,a] of [[3,.18],[1.8,.35],[1,.7]]){q.strokeStyle=`rgba(${rgb},${a})`;q.lineWidth=w*k;q.lineCap='round';q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke()}q.strokeStyle=core||'rgba(255,255,255,.95)';q.lineWidth=w*.35;q.beginPath();q.moveTo(x1,y1);q.lineTo(x2,y2);q.stroke()})}
function bolt(q,seed,x1,y1,x2,y2,rgb,w){const R=rng(seed),n=7;const pts=[[x1,y1]];for(let i=1;i<n;i++){const t=i/n;pts.push([x1+(x2-x1)*t+(R()-.5)*12,y1+(y2-y1)*t+(R()-.5)*12])}pts.push([x2,y2]);
 add(q,()=>{for(const [lw,a] of [[w*3,.25],[w*1.6,.5],[w*.6,1]]){q.strokeStyle=lw<w?'rgba(255,255,255,.95)':`rgba(${rgb},${a})`;q.lineWidth=lw;q.beginPath();pts.forEach((p,i)=>i?q.lineTo(p[0],p[1]):q.moveTo(p[0],p[1]));q.stroke()}})}
function flame(q,x,y,s,hot,mid){const g=q.createRadialGradient(x,y+s*.35,0,x,y,s*1.25);g.addColorStop(0,hot||'#fffbd0');g.addColorStop(.35,mid||'#ffb030');g.addColorStop(.75,'rgba(220,60,10,.75)');g.addColorStop(1,'rgba(120,20,0,0)');q.fillStyle=g;
 q.beginPath();q.moveTo(x,y-s*1.4);q.bezierCurveTo(x+s*.25,y-s*.9,x+s*1,y-s*.5,x+s*.8,y+s*.35);q.bezierCurveTo(x+s*.6,y+s*.9,x-s*.6,y+s*.9,x-s*.8,y+s*.35);q.bezierCurveTo(x-s*1,y-s*.4,x-s*.2,y-s*.7,x,y-s*1.4);q.fill()}
// กำปั้น (มองด้านหน้า) พร้อมเงาข้อนิ้ว
function fist(q,x,y,s,skin,shade){q.save();q.translate(x,y);q.scale(s,s);const sk=skin||'#e8b07a',sh=shade||'#8a5430';
 const g=q.createLinearGradient(-14,-12,14,14);g.addColorStop(0,sk);g.addColorStop(1,sh);q.fillStyle=g;q.strokeStyle='#2a1408';q.lineWidth=1.2;
 q.beginPath();q.moveTo(-14,-8);q.quadraticCurveTo(-15,12,-4,16);q.lineTo(10,16);q.quadraticCurveTo(16,10,15,-4);q.lineTo(13,-10);q.quadraticCurveTo(0,-14,-14,-8);q.closePath();q.fill();q.stroke();
 for(let i=0;i<4;i++){const kx=-11+i*7;const k=q.createRadialGradient(kx-1,-9,0,kx,-8,5);k.addColorStop(0,'rgba(255,240,220,.9)');k.addColorStop(1,'rgba(255,240,220,0)');q.fillStyle=k;q.beginPath();q.arc(kx,-8,4.5,0,TAU);q.fill();
  q.strokeStyle='rgba(60,24,8,.7)';q.beginPath();q.moveTo(kx+3.2,-10);q.quadraticCurveTo(kx+3.8,-2,kx+3,4);q.stroke()}
 q.fillStyle=sh;q.beginPath();q.moveTo(-14,2);q.quadraticCurveTo(-4,0,4,6);q.quadraticCurveTo(-4,10,-12,8);q.closePath();q.fill();q.strokeStyle='#2a1408';q.stroke();
 q.fillStyle='#d8c090';q.fillRect(-14,14,28,6);q.strokeRect(-14,14,28,6);q.strokeStyle='rgba(120,90,40,.8)';for(let i=0;i<5;i++){q.beginPath();q.moveTo(-12+i*6,14);q.lineTo(-9+i*6,20);q.stroke()}
 q.restore()}
function arrow(q,x,y,ang,L,o={}){q.save();q.translate(x,y);q.rotate(ang);const sh=q.createLinearGradient(0,-1.5,0,1.5);sh.addColorStop(0,'#c89a62');sh.addColorStop(1,'#5a3a1a');q.strokeStyle=sh;q.lineWidth=2.6;q.beginPath();q.moveTo(-L/2,0);q.lineTo(L/2,0);q.stroke();
 const h=q.createLinearGradient(L/2-3,-5,L/2+8,5);h.addColorStop(0,'#e8eef8');h.addColorStop(1,o.tip||'#6a7488');q.fillStyle=h;q.strokeStyle='#14161e';q.lineWidth=.9;q.beginPath();q.moveTo(L/2+9,0);q.lineTo(L/2-2,-5);q.lineTo(L/2+1,0);q.lineTo(L/2-2,5);q.closePath();q.fill();q.stroke();
 q.fillStyle=o.fl||'#c8382a';for(const s of [-1,1]){q.beginPath();q.moveTo(-L/2+9,0);q.quadraticCurveTo(-L/2+3,s*6,-L/2-2,s*6);q.lineTo(-L/2+2,0);q.closePath();q.fill()}q.restore()}
function skull(q,x,y,s,bone,eye){q.save();q.translate(x,y);q.scale(s,s);const g=q.createRadialGradient(-4,-6,2,0,0,18);g.addColorStop(0,'#fffbe8');g.addColorStop(1,bone||'#a89a78');q.fillStyle=g;q.strokeStyle='#201a10';q.lineWidth=1.2;
 q.beginPath();q.arc(0,-3,13,Math.PI*.85,Math.PI*2.15);q.lineTo(8,12);q.lineTo(-8,12);q.closePath();q.fill();q.stroke();q.fillStyle='#120c08';for(const s2 of [-1,1]){q.beginPath();q.ellipse(s2*5.5,-1,4,4.6,0,0,TAU);q.fill()}
 q.beginPath();q.moveTo(0,4);q.lineTo(-2,8);q.lineTo(2,8);q.closePath();q.fill();for(let i=-2;i<=2;i++){q.fillRect(i*3-1,11,2,4)}
 if(eye){add(q,()=>{for(const s2 of [-1,1])glow(q,s2*5.5,-1,7,eye,1)})}q.restore()}
function bat(q,x,y,s,col){q.save();q.translate(x,y);q.scale(s,s);q.fillStyle=col||'#1a0a14';q.beginPath();q.moveTo(0,-3);q.quadraticCurveTo(-6,-8,-20,-6);q.quadraticCurveTo(-15,-2,-16,3);q.quadraticCurveTo(-11,0,-9,4);q.quadraticCurveTo(-5,1,-3,5);q.lineTo(0,3);q.lineTo(3,5);q.quadraticCurveTo(5,1,9,4);q.quadraticCurveTo(11,0,16,3);q.quadraticCurveTo(15,-2,20,-6);q.quadraticCurveTo(6,-8,0,-3);q.fill();
 q.beginPath();q.moveTo(-2,-3);q.lineTo(-2.5,-7);q.lineTo(0,-4.5);q.lineTo(2.5,-7);q.lineTo(2,-3);q.fill();add(q,()=>{q.fillStyle='#ff3040';q.fillRect(-1.6,-4,1,1);q.fillRect(.6,-4,1,1)});q.restore()}
function feather(q,x,y,ang,L,col){q.save();q.translate(x,y);q.rotate(ang);const g=q.createLinearGradient(-5,0,5,0);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(.5,col||'#fffaf0');g.addColorStop(1,'rgba(220,230,255,.7)');q.fillStyle=g;
 q.beginPath();q.moveTo(0,0);q.quadraticCurveTo(-6,-L*.5,0,-L);q.quadraticCurveTo(6,-L*.5,0,0);q.fill();q.strokeStyle='rgba(180,170,140,.9)';q.lineWidth=.8;q.beginPath();q.moveTo(0,2);q.lineTo(0,-L);q.stroke();
 q.strokeStyle='rgba(200,200,220,.5)';for(let i=1;i<6;i++){const t=-L*i/6;q.beginPath();q.moveTo(0,t);q.lineTo(-4,t+3);q.moveTo(0,t);q.lineTo(4,t+3);q.stroke()}q.restore()}
function wing(q,x,y,dir,s){q.save();q.translate(x,y);q.scale(dir*s,s);for(let i=0;i<7;i++){feather(q,0,0,-.2-i*.22,34-i*2.5,i%2?'#fff6e0':'#ffffff')}q.restore()}
function spear(q,x,y,ang,L,o={}){q.save();q.translate(x,y);q.rotate(ang);const s=q.createLinearGradient(0,-2,0,2);s.addColorStop(0,'#8a4a2a');s.addColorStop(1,'#3a1a0a');q.strokeStyle=s;q.lineWidth=3;q.beginPath();q.moveTo(-L/2,0);q.lineTo(L/2-10,0);q.stroke();
 q.fillStyle=o.tas||'#c82a2a';q.beginPath();q.moveTo(L/2-12,0);q.lineTo(L/2-16,5);q.lineTo(L/2-19,4);q.lineTo(L/2-14,0);q.fill();
 const h=q.createLinearGradient(L/2-10,-4,L/2+8,4);h.addColorStop(0,'#5a6476');h.addColorStop(.5,o.c||'#f2f6ff');h.addColorStop(1,'#4a5264');q.fillStyle=h;q.strokeStyle='#12141c';q.lineWidth=1;q.beginPath();q.moveTo(L/2+10,0);q.lineTo(L/2-4,-5);q.lineTo(L/2-10,-2);q.lineTo(L/2-10,2);q.lineTo(L/2-4,5);q.closePath();q.fill();q.stroke();
 add(q,()=>{q.strokeStyle='rgba(255,255,255,.8)';q.lineWidth=.8;q.beginPath();q.moveTo(L/2-4,-4);q.lineTo(L/2+9,0);q.stroke()});q.restore()}
function shield(q,x,y,s,face,rim){q.save();q.translate(x,y);q.scale(s,s);const g=q.createLinearGradient(-18,-20,18,22);g.addColorStop(0,'#fff4c8');g.addColorStop(.4,face||'#d8a83a');g.addColorStop(1,'#5a3a0a');q.fillStyle=g;q.strokeStyle='#1a1004';q.lineWidth=1.5;
 q.beginPath();q.moveTo(0,-22);q.quadraticCurveTo(14,-18,19,-20);q.quadraticCurveTo(20,8,0,24);q.quadraticCurveTo(-20,8,-19,-20);q.quadraticCurveTo(-14,-18,0,-22);q.fill();q.stroke();
 q.strokeStyle=rim||'rgba(255,250,220,.9)';q.lineWidth=2.2;q.beginPath();q.moveTo(0,-17);q.quadraticCurveTo(11,-14,15,-15.5);q.quadraticCurveTo(15.5,5,0,18.5);q.quadraticCurveTo(-15.5,5,-15,-15.5);q.quadraticCurveTo(-11,-14,0,-17);q.stroke();
 q.fillStyle='rgba(255,255,255,.25)';q.beginPath();q.moveTo(-14,-16);q.quadraticCurveTo(-6,-15,-2,-17);q.lineTo(-4,4);q.quadraticCurveTo(-12,0,-14,-16);q.fill();q.restore()}
function grenade(q,x,y,s){q.save();q.translate(x,y);q.scale(s,s);const g=q.createRadialGradient(-4,-4,1,0,0,13);g.addColorStop(0,'#a8b890');g.addColorStop(1,'#2a3420');q.fillStyle=g;q.strokeStyle='#0a0e06';q.lineWidth=1.2;q.beginPath();q.ellipse(0,2,10,12,0,0,TAU);q.fill();q.stroke();
 q.strokeStyle='rgba(0,0,0,.45)';for(let i=-1;i<=1;i++){q.beginPath();q.moveTo(-10,2+i*6);q.quadraticCurveTo(0,4+i*6,10,2+i*6);q.stroke();q.beginPath();q.moveTo(i*5,-10);q.quadraticCurveTo(i*6,2,i*5,14);q.stroke()}
 q.fillStyle='#8a8a92';q.fillRect(-4,-14,8,5);q.strokeRect(-4,-14,8,5);q.strokeStyle='#c0c4cc';q.lineWidth=1.6;q.beginPath();q.arc(7,-12,4,0,TAU);q.stroke();q.restore()}
function shell(q,x,y,s){q.save();q.translate(x,y);q.scale(s,s);const g=q.createRadialGradient(-6,-10,2,0,-2,30);g.addColorStop(0,'#c8e090');g.addColorStop(.6,'#4a7a2a');g.addColorStop(1,'#1a2a0a');q.fillStyle=g;q.strokeStyle='#0a1204';q.lineWidth=1.4;
 q.beginPath();q.ellipse(0,0,28,20,0,Math.PI,TAU);q.lineTo(28,4);q.quadraticCurveTo(0,10,-28,4);q.closePath();q.fill();q.stroke();
 q.strokeStyle='rgba(20,40,8,.9)';q.lineWidth=1.2;const hx=[[0,-12],[-14,-6],[14,-6],[-7,-1],[7,-1]];for(const [hx0,hy] of hx){q.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6;q.lineTo(hx0+Math.cos(a)*6.5,hy+Math.sin(a)*4.5)}q.closePath();q.stroke();q.fillStyle='rgba(220,255,160,.18)';q.fill()}
 q.fillStyle='#7a9a5a';q.strokeStyle='#0a1204';q.beginPath();q.ellipse(33,0,7,5.5,0,0,TAU);q.fill();q.stroke();q.fillStyle='#000';q.beginPath();q.arc(35,-1.5,1.2,0,TAU);q.fill();
 for(const lx of [-18,14]){q.fillStyle='#6a8a4a';q.beginPath();q.ellipse(lx,8,6,4,0,0,TAU);q.fill();q.stroke()}q.restore()}
function serpent(q,x,y,s,col,belly){q.save();q.translate(x,y);q.scale(s,s);q.lineCap='round';
 const path=()=>{q.beginPath();q.moveTo(-30,26);q.bezierCurveTo(-36,6,4,10,-4,-6);q.bezierCurveTo(-10,-18,14,-24,18,-14)};
 q.strokeStyle='#081a18';q.lineWidth=13;path();q.stroke();const g=q.createLinearGradient(-30,0,20,0);g.addColorStop(0,col||'#1a6a6a');g.addColorStop(1,'#2aa0a0');q.strokeStyle=g;q.lineWidth=10.5;path();q.stroke();
 q.setLineDash([2.2,2.6]);q.strokeStyle=belly||'rgba(200,255,230,.55)';q.lineWidth=4;path();q.stroke();q.setLineDash([]);
 q.save();q.translate(18,-14);q.rotate(-.5);const hg=q.createLinearGradient(-6,-8,10,8);hg.addColorStop(0,'#3ac0b0');hg.addColorStop(1,'#0a4a48');q.fillStyle=hg;q.strokeStyle='#061412';q.lineWidth=1.2;q.beginPath();q.moveTo(-4,-7);q.quadraticCurveTo(12,-9,15,0);q.quadraticCurveTo(12,7,-4,7);q.closePath();q.fill();q.stroke();
 q.fillStyle='#ffd040';q.beginPath();q.ellipse(4,-3.5,2.4,1.6,0,0,TAU);q.fill();q.fillStyle='#000';q.fillRect(3.6,-4.8,.9,2.6);
 q.fillStyle='#e0d8b0';q.beginPath();q.moveTo(-2,-7);q.lineTo(-10,-14);q.lineTo(-4,-5);q.fill();q.beginPath();q.moveTo(0,-7);q.lineTo(-4,-17);q.lineTo(2,-6);q.fill();q.restore();q.restore()}
function bell(q,x,y,s){q.save();q.translate(x,y);q.scale(s,s);const g=q.createLinearGradient(-16,0,16,0);g.addColorStop(0,'#6a4810');g.addColorStop(.35,'#ffe9a0');g.addColorStop(.6,'#d8a83a');g.addColorStop(1,'#4a300a');q.fillStyle=g;q.strokeStyle='#1a1004';q.lineWidth=1.3;
 q.beginPath();q.moveTo(-4,-18);q.quadraticCurveTo(-12,-16,-12,-4);q.quadraticCurveTo(-12,8,-18,14);q.lineTo(18,14);q.quadraticCurveTo(12,8,12,-4);q.quadraticCurveTo(12,-16,4,-18);q.closePath();q.fill();q.stroke();
 q.fillStyle='#8a6a20';q.beginPath();q.ellipse(0,14,18,3.5,0,0,TAU);q.fill();q.stroke();q.fillStyle='#3a2a08';q.beginPath();q.arc(0,18,3.5,0,TAU);q.fill();q.strokeStyle='#d8a83a';q.lineWidth=2;q.beginPath();q.arc(0,-20,3,0,TAU);q.stroke();
 q.strokeStyle='rgba(255,250,220,.6)';q.lineWidth=1;q.beginPath();q.moveTo(-9,-10);q.quadraticCurveTo(-9,4,-13,10);q.stroke();q.restore()}
function horn(q,x,y,ang,s){q.save();q.translate(x,y);q.rotate(ang);q.scale(s,s);const g=q.createLinearGradient(-26,0,26,0);g.addColorStop(0,'#5a3a14');g.addColorStop(.5,'#d8b878');g.addColorStop(1,'#fff0d0');q.fillStyle=g;q.strokeStyle='#2a1a08';q.lineWidth=1.3;
 q.beginPath();q.moveTo(-26,6);q.quadraticCurveTo(-6,-22,20,-18);q.lineTo(24,4);q.quadraticCurveTo(0,-6,-24,10);q.closePath();q.fill();q.stroke();
 q.fillStyle='#1a0e04';q.beginPath();q.ellipse(22,-7,3.5,11,.15,0,TAU);q.fill();q.strokeStyle='#d8a83a';q.lineWidth=2.2;q.beginPath();q.ellipse(22,-7,4,11.5,.15,0,TAU);q.stroke();
 q.strokeStyle='#d8a83a';q.lineWidth=2.6;for(const t of [-14,2]){q.beginPath();q.moveTo(t,-12-(t+14)*.18);q.lineTo(t-3,4-(t+14)*.12);q.stroke()}
 q.strokeStyle='rgba(255,250,230,.55)';q.lineWidth=1.2;q.beginPath();q.moveTo(-20,2);q.quadraticCurveTo(-4,-17,16,-15);q.stroke();q.restore()}
// เงาคน (ขาแขนเป็นเส้นหนาปลายมน) + ขอบเรืองแสง
const POSE={
 stand:{h:[0,-27,6],t:[[0,-20],[0,1]],l:[[[0,-17],[-10,-6],[-12,5]],[[0,-17],[10,-8],[15,-17]],[[0,1],[-6,15],[-8,28]],[[0,1],[6,15],[8,28]]]},
 kick:{h:[-12,-19,6],t:[[-9,-13],[2,2]],l:[[[2,2],[17,-5],[31,-11]],[[2,2],[-2,14],[-11,21]],[[-7,-11],[-17,-5],[-24,-11]],[[-7,-11],[2,-21],[6,-26]]]},
 raise:{h:[0,-27,6],t:[[0,-20],[0,1]],l:[[[0,-17],[-10,-8],[-14,2]],[[0,-17],[7,-26],[8,-36]],[[0,1],[-7,15],[-9,28]],[[0,1],[7,15],[9,28]]]}};
function person(q,x,y,s,pose,col,rim,extra){const P=POSE[pose];q.save();q.translate(x,y);q.scale(s,s);q.lineCap='round';q.lineJoin='round';
 const draw=(w)=>{q.lineWidth=10+w;q.beginPath();q.moveTo(...P.t[0]);q.lineTo(...P.t[1]);q.stroke();q.lineWidth=6+w;for(const L of P.l){q.beginPath();q.moveTo(...L[0]);q.lineTo(...L[1]);q.lineTo(...L[2]);q.stroke()}q.beginPath();q.arc(P.h[0],P.h[1],P.h[2]+w/2,0,TAU);q.fill()};
 if(rim){add(q,()=>{q.strokeStyle=q.fillStyle=`rgba(${rim},.9)`;draw(3.2)});glow(q,0,-6,34,rim,.25)}
 q.strokeStyle=q.fillStyle=col;draw(0);if(extra)extra(q,P);q.restore()}
function wing2(q,x,y,dir,s){q.save();q.translate(x,y);q.scale(dir*s,s);
 for(let row=0;row<2;row++)for(let i=8;i>=0;i--){const t=i/8,px=t*40,py=-t*26+t*t*12;feather(q,px,py-row*3,Math.PI*.86-t*.55,row?8+t*8:15+t*18,row?'#f4f0ff':'#ffffff')}
 q.strokeStyle='rgba(200,190,160,.9)';q.lineWidth=2.4;q.beginPath();q.moveTo(0,0);q.quadraticCurveTo(22,-22,40,-14);q.stroke();q.restore()}
function scales(q,x0,y0,w,h,c1,c2){for(let r=0;r<h/7;r++)for(let c=0;c<w/10;c++){const x=x0+c*10+(r%2)*5,y=y0+r*7;const g=q.createRadialGradient(x,y-2,0,x,y,7);g.addColorStop(0,c1);g.addColorStop(1,c2);q.fillStyle=g;q.strokeStyle='rgba(0,0,0,.55)';q.lineWidth=.8;q.beginPath();q.arc(x,y,6,0,Math.PI);q.fill();q.stroke()}}

// ---------------- ไอคอนทั้ง 33 ท่า ----------------
const D={
// ⚔️ นักดาบ
'ทะยานดาบ':q=>{bg(q,'#2a4a7a','#04080f','120,180,255',hash('a1'));streaks(q,3,26,20,70,0,80,'170,210,255',1.2);
 add(q,()=>{for(let i=0;i<4;i++){q.globalAlpha=.18+i*.12;blade(q,24+i*10,74-i*10,.785,56,4.5,{noHilt:true,c:'#b8d8ff'})}});q.globalAlpha=1;
 glow(q,70,30,26,'180,220,255',.8);blade(q,60,40,.785,58,5);sparks(q,9,20,72,24,16,'220,240,255')},
'ปราการเหล็ก':q=>{bg(q,'#5a5a64','#0a0a0e','200,200,220',hash('a2'));shock(q,48,74,40,12,'255,200,120',3);rocks(q,4,10,48,80,70,'#4a3a2a');
 glow(q,48,46,34,'255,220,150',.45);shield(q,48,46,1.15,'#9aa4b4','rgba(240,246,255,.9)');
 q.fillStyle='#2a2e38';q.beginPath();q.arc(48,44,6,0,TAU);q.fill();add(q,()=>glow(q,46,40,10,'255,255,255',.5))},
'ดาบผ่าฟ้า':q=>{bg(q,'#2a2a5a','#020208','150,150,255',hash('a3'));bolt(q,5,58,4,44,46,'170,200,255',2.2);bolt(q,8,40,6,30,40,'170,200,255',1.2);
 add(q,()=>{q.strokeStyle='rgba(200,230,255,.9)';q.lineWidth=5;q.beginPath();q.arc(48,96,62,-2.6,-.55);q.stroke();q.strokeStyle='rgba(120,170,255,.35)';q.lineWidth=12;q.beginPath();q.arc(48,96,58,-2.6,-.55);q.stroke()});
 blade(q,48,88,0,64,6,{c:'#f4f8ff'});glow(q,48,28,20,'220,235,255',.9)},
// 🔮 นักเวท
'วาร์ปเวท':q=>{bg(q,'#3a2a6a','#05030f','170,130,255',hash('b1'));
 add(q,()=>{for(let i=0;i<5;i++){q.strokeStyle=`rgba(190,150,255,${.8-i*.13})`;q.lineWidth=3-i*.4;q.beginPath();q.arc(62,34,6+i*5,i*.9,i*.9+4.4);q.stroke()}});glow(q,62,34,20,'200,160,255',.9);
 for(let i=0;i<7;i++)crystal(q,26+Math.cos(i*.9)*12,74+Math.sin(i*.9)*4,10+(i%3)*5,4,(i-3)*.32);glow(q,26,70,18,'150,220,255',.5);sparks(q,11,18,62,34,20,'230,210,255')},
'คุกน้ำแข็ง':q=>{bg(q,'#2a5a8a','#020a14','160,220,255',hash('b2'));glow(q,48,56,40,'150,210,255',.5);
 crystal(q,48,80,58,13,0);crystal(q,30,82,40,9,-.35);crystal(q,66,82,42,9,.35);crystal(q,18,84,22,6,-.6);crystal(q,78,84,24,6,.6);
 q.fillStyle='rgba(20,30,50,.55)';q.beginPath();q.ellipse(48,62,7,10,0,0,TAU);q.fill();sparks(q,21,30,48,40,36,'230,248,255');streaks(q,4,10,48,50,30,46,'200,240,255',1)},
'ลำแสงอาร์เคน':q=>{bg(q,'#4a1a6a','#06020c','220,120,255',hash('b3'));
 add(q,()=>{for(let i=0;i<3;i++){q.strokeStyle=`rgba(230,170,255,${.75-i*.2})`;q.lineWidth=1.6;q.beginPath();q.ellipse(22,70,10+i*6,16+i*8,-.78,0,TAU);q.stroke()}});
 beam(q,22,72,92,4,9,'210,120,255');glow(q,22,72,22,'255,200,255',1);sparks(q,31,26,58,38,30,'255,210,255')},
// 🏹 นักธนู
'กับดักหนาม':q=>{bg(q,'#3a4a2a','#060a04','150,180,110',hash('c1'));
 q.fillStyle='#2a2014';q.beginPath();q.ellipse(48,66,34,12,0,0,TAU);q.fill();
 const tr=(x,y,s)=>{q.save();q.translate(x,y);q.scale(s,s);const g=q.createLinearGradient(-14,0,14,0);g.addColorStop(0,'#3a3a40');g.addColorStop(.5,'#c8ccd4');g.addColorStop(1,'#3a3a40');q.strokeStyle=g;q.lineWidth=3;q.beginPath();q.ellipse(0,0,14,5,0,0,TAU);q.stroke();
  q.fillStyle=g;for(let i=0;i<9;i++){const a=i/9*TAU,px=Math.cos(a)*13,py=Math.sin(a)*4.5;q.beginPath();q.moveTo(px-2,py);q.lineTo(px*.85,py-9);q.lineTo(px+2,py);q.fill()}q.restore()};
 tr(28,64,.8);tr(66,66,.85);tr(48,58,1.15);shock(q,48,58,24,8,'255,200,90',2);sparks(q,6,14,48,52,18,'255,220,140')},
'ธนูพิษงูเห่า':q=>{bg(q,'#2a4a1a','#030802','140,220,90',hash('c2'));
 const R=rng(77);for(let i=0;i<10;i++){const x=58+R()*30,y=58+R()*30,r=10+R()*14;const g=q.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(150,255,80,.35)');g.addColorStop(1,'rgba(60,140,20,0)');q.fillStyle=g;q.fillRect(x-r,y-r,r*2,r*2)}
 add(q,()=>{q.strokeStyle='rgba(150,255,90,.45)';q.lineWidth=7;q.beginPath();q.moveTo(10,86);q.lineTo(70,26);q.stroke()});arrow(q,44,52,-.785,66,{tip:'#3a8a1a',fl:'#2a6a1a'});
 for(let i=0;i<3;i++){q.fillStyle='rgba(140,255,80,.9)';q.beginPath();const x=72+i*3,y=30+i*7;q.moveTo(x,y);q.quadraticCurveTo(x+3,y+5,x,y+7);q.quadraticCurveTo(x-3,y+5,x,y);q.fill()}glow(q,72,26,12,'170,255,100',.8)},
'ธนูวายุคลั่ง':q=>{bg(q,'#2a6a6a','#020c0c','150,255,230',hash('c3'));
 add(q,()=>{for(let i=0;i<6;i++){q.strokeStyle=`rgba(190,255,240,${.65-i*.08})`;q.lineWidth=2.6-i*.25;q.beginPath();q.arc(48,48,8+i*7,i*1.1,i*1.1+3.9);q.stroke()}});
 glow(q,48,48,24,'200,255,240',.8);arrow(q,50,46,-.785,82,{tip:'#ffffff',fl:'#2ad0b0'});streaks(q,12,18,48,48,30,46,'200,255,240',1)},
// 🥷 นินจา
'ประทับเงา':q=>{bg(q,'#2a2a52','#020208','120,120,220',hash('d1'));
 q.save();q.translate(64,32);q.rotate(.785);const k=q.createLinearGradient(-3,0,3,0);k.addColorStop(0,'#3a4050');k.addColorStop(.5,'#e8eef8');k.addColorStop(1,'#3a4050');q.fillStyle=k;q.strokeStyle='#0a0c14';q.lineWidth=1;q.beginPath();q.moveTo(0,-20);q.lineTo(5,-4);q.lineTo(0,0);q.lineTo(-5,-4);q.closePath();q.fill();q.stroke();
 q.fillStyle='#2a1a1a';q.fillRect(-1.6,0,3.2,12);q.strokeStyle='#c8a050';q.lineWidth=2;q.beginPath();q.arc(0,15,3.5,0,TAU);q.stroke();q.restore();
 person(q,28,58,1.05,'stand','#0a0a18','140,140,255',(q)=>{q.strokeStyle='#c82a3a';q.lineWidth=2;q.beginPath();q.moveTo(-6,-28);q.lineTo(6,-28);q.stroke();q.beginPath();q.moveTo(-5,-28);q.quadraticCurveTo(-14,-30,-18,-24);q.stroke()});
 add(q,()=>{q.strokeStyle='rgba(150,150,255,.8)';q.lineWidth=1.6;q.setLineDash([3,4]);q.beginPath();q.moveTo(44,42);q.quadraticCurveTo(52,26,58,34);q.stroke();q.setLineDash([])});
 add(q,()=>{q.strokeStyle='rgba(220,40,60,.9)';q.lineWidth=1.8;q.beginPath();q.arc(64,36,12,0,TAU);q.moveTo(52,36);q.lineTo(76,36);q.moveTo(64,24);q.lineTo(64,48);q.stroke()});glow(q,64,36,14,'255,60,80',.4)},
'ร่างแยกเงา':q=>{bg(q,'#2a2244','#020206','140,120,220',hash('d2'));
 const band=(q)=>{q.strokeStyle='#c82a3a';q.lineWidth=2;q.beginPath();q.moveTo(-6,-28);q.lineTo(6,-28);q.moveTo(-5,-28);q.quadraticCurveTo(-14,-30,-18,-23);q.stroke()};
 q.globalAlpha=.45;add(q,()=>{person(q,22,56,.85,'stand','#5a4ad8',null,band);person(q,74,56,.85,'stand','#5a4ad8',null,band)});q.globalAlpha=1;
 person(q,48,54,1.05,'stand','#0a0818','170,150,255',band);blade(q,64,40,.35,30,2.4,{noHilt:true})},
'ดาบจันทร์โลหิต':q=>{bg(q,'#4a0a14','#080104','255,60,80',hash('d3'));const m=q.createRadialGradient(56,32,2,56,32,22);m.addColorStop(0,'#ffe0d0');m.addColorStop(.6,'#ff3a3a');m.addColorStop(1,'rgba(160,0,20,0)');q.fillStyle=m;q.beginPath();q.arc(56,32,22,0,TAU);q.fill();
 q.fillStyle='#4a0a14';q.beginPath();q.arc(64,26,16,0,TAU);q.fill();
 add(q,()=>{q.strokeStyle='rgba(255,90,90,.95)';q.lineWidth=4.5;q.beginPath();q.arc(48,56,32,2.2,5.6);q.stroke();q.strokeStyle='rgba(255,40,60,.35)';q.lineWidth=12;q.beginPath();q.arc(48,56,30,2.2,5.6);q.stroke()});
 blade(q,40,78,-.5,52,3.6,{c:'#ffe8e8',h:'#2a1a1a'});const R=rng(5);for(let i=0;i<9;i++){q.fillStyle='rgba(200,10,30,.9)';q.beginPath();q.arc(20+R()*56,60+R()*28,1+R()*2,0,TAU);q.fill()}},
// 🔫 สไนเปอร์
'ระเบิดมือแสง':q=>{bg(q,'#5a5a2a','#0a0a02','255,240,160',hash('e1'));glow(q,62,40,40,'255,250,210',1);streaks(q,6,30,62,40,10,46,'255,250,220',1.6);
 add(q,()=>{q.fillStyle='rgba(255,255,255,.95)';q.beginPath();for(let i=0;i<8;i++){const a=i*TAU/8,r=i%2?7:22;q.lineTo(62+Math.cos(a)*r,40+Math.sin(a)*r)}q.closePath();q.fill()});grenade(q,32,64,1.25)},
'โหมดซุ่มยิง':q=>{bg(q,'#2a3a2a','#020402','150,200,150',hash('e2'));
 q.save();q.beginPath();q.arc(48,48,30,0,TAU);q.clip();const l=q.createRadialGradient(42,40,4,48,48,30);l.addColorStop(0,'rgba(170,230,190,.55)');l.addColorStop(1,'rgba(10,40,20,.8)');q.fillStyle=l;q.fillRect(0,0,96,96);
 q.fillStyle='rgba(20,30,20,.85)';q.beginPath();q.ellipse(58,62,10,14,0,0,TAU);q.fill();q.beginPath();q.arc(58,44,6,0,TAU);q.fill();q.restore();
 const r=q.createLinearGradient(0,18,0,78);r.addColorStop(0,'#6a6e78');r.addColorStop(.5,'#1a1c22');r.addColorStop(1,'#4a4e58');q.strokeStyle=r;q.lineWidth=7;q.beginPath();q.arc(48,48,33,0,TAU);q.stroke();
 q.strokeStyle='rgba(255,60,50,.95)';q.lineWidth=1.2;q.beginPath();q.moveTo(18,48);q.lineTo(42,48);q.moveTo(54,48);q.lineTo(78,48);q.moveTo(48,18);q.lineTo(48,42);q.moveTo(48,54);q.lineTo(48,78);q.stroke();q.beginPath();q.arc(48,48,3,0,TAU);q.stroke();
 for(let i=1;i<4;i++){q.beginPath();q.moveTo(46,48+i*6);q.lineTo(50,48+i*6);q.stroke()}add(q,()=>{q.fillStyle='rgba(255,255,255,.35)';q.beginPath();q.ellipse(38,34,8,4,-.6,0,TAU);q.fill()})},
'กระสุนเรลกัน':q=>{bg(q,'#1a3a5a','#02060c','120,200,255',hash('e3'));beam(q,4,82,92,14,10,'110,200,255');
 add(q,()=>{for(let i=0;i<5;i++){const t=i/5,x=14+t*70,y=74-t*53;q.strokeStyle=`rgba(170,230,255,${.8-t*.4})`;q.lineWidth=1.6;q.beginPath();q.ellipse(x,y,5,13,.66,0,TAU);q.stroke()}});
 q.save();q.translate(16,78);q.rotate(-.66);q.fillStyle='#2a2e38';q.fillRect(-14,-5,24,10);q.fillStyle='#4a5060';q.fillRect(-14,-5,24,3);q.restore();bolt(q,13,20,70,56,46,'140,220,255',.8);glow(q,88,16,14,'220,245,255',1)},
// 🛡️ พาลาดิน
'พุ่งโล่ศรัทธา':q=>{bg(q,'#6a5a2a','#0a0802','255,230,150',hash('f1'));streaks(q,8,26,82,48,0,90,'255,240,190',1.4);
 add(q,()=>{for(let i=1;i<4;i++){q.globalAlpha=.16*i;shield(q,26+i*8,50,1,'#ffe9a0')}});q.globalAlpha=1;glow(q,62,48,30,'255,240,180',.7);shield(q,62,48,1.25);
 add(q,()=>{q.strokeStyle='rgba(255,255,230,.9)';q.lineWidth=2.4;q.beginPath();q.moveTo(62,36);q.lineTo(62,60);q.moveTo(54,44);q.lineTo(70,44);q.stroke()})},
'ออร่าศักดิ์สิทธิ์':q=>{bg(q,'#6a5a20','#0a0802','255,235,160',hash('f2'));glow(q,48,50,44,'255,235,160',.75);
 add(q,()=>{for(let i=0;i<16;i++){const a=i*TAU/16;q.strokeStyle=`rgba(255,245,200,${i%2?.35:.7})`;q.lineWidth=i%2?1.2:2.2;q.beginPath();q.moveTo(48+Math.cos(a)*14,50+Math.sin(a)*14);q.lineTo(48+Math.cos(a)*44,50+Math.sin(a)*44);q.stroke()}
  q.strokeStyle='rgba(255,250,220,.9)';q.lineWidth=2;q.beginPath();q.ellipse(48,74,30,8,0,0,TAU);q.stroke();q.beginPath();q.ellipse(48,24,14,4,0,0,TAU);q.stroke()});
 person(q,48,52,1.05,'raise','#3a2a0a','255,240,180');blade(q,56,18,.1,26,3,{c:'#fffbe0',noHilt:true});sparks(q,17,30,48,50,40,'255,245,200')},
'ดาบตัดสินโลกันตร์':q=>{bg(q,'#5a4a14','#080602','255,225,140',hash('f3'));shock(q,48,80,42,11,'255,230,150',3);
 add(q,()=>{q.fillStyle='rgba(255,250,220,.5)';q.beginPath();q.moveTo(38,0);q.lineTo(58,0);q.lineTo(54,80);q.lineTo(42,80);q.closePath();q.fill()});
 blade(q,48,74,Math.PI,66,7,{c:'#fffbea',h:'#ffe070'});
 q.save();q.translate(48,16);q.strokeStyle='#ffe9a0';q.lineWidth=1.6;q.beginPath();q.moveTo(-18,0);q.lineTo(18,0);q.moveTo(-18,0);q.lineTo(-22,9);q.lineTo(-14,9);q.closePath();q.moveTo(18,0);q.lineTo(14,9);q.lineTo(22,9);q.closePath();q.stroke();q.restore();rocks(q,9,9,48,84,70,'#5a4a2a')},
// ✨ นักบวช
'ชำระล้าง':q=>{bg(q,'#2a6a7a','#020a0e','190,250,255',hash('g1'));glow(q,48,48,42,'200,250,255',.7);shock(q,48,50,38,38,'210,250,255',2);
 wing2(q,44,52,-1,.78);wing2(q,52,52,1,.78);
 q.save();q.translate(48,58);const g=q.createLinearGradient(-10,-10,10,10);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#b8d0e0');q.fillStyle=g;q.strokeStyle='#5a7a8a';q.lineWidth=1;
 q.beginPath();q.ellipse(0,0,7,11,0,0,TAU);q.fill();q.stroke();q.beginPath();q.arc(0,-12,5,0,TAU);q.fill();q.stroke();q.fillStyle='#e8a030';q.beginPath();q.moveTo(-1.6,-9);q.lineTo(0,-5);q.lineTo(1.6,-9);q.fill();
 q.fillStyle='#000';q.beginPath();q.arc(-2,-13,.9,0,TAU);q.arc(2,-13,.9,0,TAU);q.fill();q.fillStyle='#e8f0f8';q.beginPath();q.moveTo(-5,9);q.lineTo(0,20);q.lineTo(5,9);q.fill();q.restore();sparks(q,23,26,48,48,40,'230,255,255')},
'ระฆังสวรรค์':q=>{bg(q,'#6a5a2a','#0a0802','255,230,160',hash('g2'));
 add(q,()=>{for(let i=0;i<4;i++){q.strokeStyle=`rgba(255,240,190,${.7-i*.15})`;q.lineWidth=2;q.beginPath();q.arc(48,46,22+i*8,.15*Math.PI,.85*Math.PI);q.stroke();q.beginPath();q.arc(48,46,22+i*8,1.15*Math.PI,1.85*Math.PI);q.stroke()}});
 glow(q,48,46,26,'255,240,180',.8);bell(q,48,44,1.2);shock(q,48,82,32,8,'255,235,170',2)},
'ปีกเทวทูต':q=>{bg(q,'#4a6a8a','#04080e','230,240,255',hash('g3'));glow(q,48,44,40,'255,250,230',.8);
 add(q,()=>{q.globalAlpha=.5;wing2(q,44,56,-1,1.08);wing2(q,52,56,1,1.08)});q.globalAlpha=1;wing2(q,44,56,-1,1);wing2(q,52,56,1,1);
 q.fillStyle='rgba(255,250,235,.95)';q.beginPath();q.ellipse(48,62,6,12,0,0,TAU);q.fill();q.beginPath();q.arc(48,44,5.5,0,TAU);q.fill();
 add(q,()=>{q.strokeStyle='rgba(255,240,170,.95)';q.lineWidth=2.2;q.beginPath();q.ellipse(48,22,10,3,0,0,TAU);q.stroke()});sparks(q,29,22,48,50,38,'255,255,230')},
// 💀 เนโคร
'ระเบิดกระดูก':q=>{bg(q,'#2a4a2a','#020602','140,255,170',hash('h1'));glow(q,48,52,40,'120,255,160',.6);streaks(q,14,22,48,52,10,46,'160,255,190',1.6);
 const R=rng(3);for(let i=0;i<9;i++){q.save();q.translate(48+(R()-.5)*70,52+(R()-.5)*60);q.rotate(R()*TAU);q.fillStyle='#e8e0c8';q.strokeStyle='#2a2418';q.lineWidth=.9;q.fillRect(-7,-1.6,14,3.2);q.strokeRect(-7,-1.6,14,3.2);for(const s of [-1,1]){q.beginPath();q.arc(s*7,-1.6,2,0,TAU);q.arc(s*7,1.6,2,0,TAU);q.fill();q.stroke()}q.restore()}
 skull(q,48,50,1.25,'#b8ac88','120,255,160')},
'ฝูงค้างคาวโลหิต':q=>{bg(q,'#4a0a1a','#060104','220,40,70',hash('h2'));const m=q.createRadialGradient(48,44,2,48,44,26);m.addColorStop(0,'#ffd8d8');m.addColorStop(.5,'#c82a3a');m.addColorStop(1,'rgba(120,0,20,0)');q.fillStyle=m;q.beginPath();q.arc(48,44,26,0,TAU);q.fill();
 add(q,()=>{q.strokeStyle='rgba(255,60,80,.45)';q.lineWidth=2;q.beginPath();q.arc(48,52,30,0,TAU);q.stroke()});
 const R=rng(8);for(let i=0;i<6;i++){const a=i/6*TAU+.5,r=30;bat(q,48+Math.cos(a)*r,54+Math.sin(a)*r*.7,.62+R()*.2,'#120408')}bat(q,48,50,1.35,'#0a0206')},
'อัศวินมรณะ':q=>{bg(q,'#1a3a2a','#010402','90,255,150',hash('h3'));glow(q,48,40,34,'90,255,150',.45);
 q.save();q.translate(48,52);const ar=q.createLinearGradient(-26,-30,26,30);ar.addColorStop(0,'#6a7482');ar.addColorStop(.5,'#1a1e26');ar.addColorStop(1,'#0a0c10');q.fillStyle=ar;q.strokeStyle='#000';q.lineWidth=1.2;
 q.beginPath();q.moveTo(-28,40);q.lineTo(-26,6);q.quadraticCurveTo(-30,-8,-14,-12);q.lineTo(14,-12);q.quadraticCurveTo(30,-8,26,6);q.lineTo(28,40);q.closePath();q.fill();q.stroke();
 q.beginPath();q.moveTo(-13,-12);q.lineTo(-13,-32);q.quadraticCurveTo(0,-40,13,-32);q.lineTo(13,-12);q.closePath();q.fill();q.stroke();
 q.fillStyle='#000';q.fillRect(-10,-26,20,4);add(q,()=>{glow(q,-5,-24,7,'90,255,150',1);glow(q,5,-24,7,'90,255,150',1)});
 for(const s of [-1,1]){q.fillStyle='#3a404c';q.beginPath();q.moveTo(s*14,-12);q.lineTo(s*24,-24);q.lineTo(s*26,-8);q.closePath();q.fill();q.stroke()}
 add(q,()=>{q.strokeStyle='rgba(255,255,255,.25)';q.lineWidth=1;q.beginPath();q.moveTo(-22,4);q.lineTo(-20,34);q.stroke()});q.restore();
 blade(q,74,86,-.25,58,4.5,{c:'#9affc0',c2:'#3a8a5a',d:'#0a2a14',h:'#2a3a30'})},
// 👊 มังค์
'ก้าวเมฆา':q=>{bg(q,'#4a6a8a','#060a10','210,230,255',hash('i1'));
 const cl=(x,y,s)=>{const R=rng(x*7+y);for(let i=0;i<7;i++){const cx=x+(R()-.5)*30*s,cy=y+(R()-.5)*8*s,r=(7+R()*7)*s;const g=q.createRadialGradient(cx,cy-r*.4,0,cx,cy,r);g.addColorStop(0,'rgba(255,255,255,.98)');g.addColorStop(1,'rgba(160,190,230,.6)');q.fillStyle=g;q.beginPath();q.arc(cx,cy,r,0,TAU);q.fill()}};
 cl(24,76,1.1);cl(50,84,.8);shock(q,76,74,18,6,'255,210,140',2);
 person(q,44,46,1.1,'kick','#2a1206','255,190,110',(q)=>{q.strokeStyle='#e8a030';q.lineWidth=3;q.beginPath();q.moveTo(-3,-6);q.lineTo(-14,4);q.stroke()});
 streaks(q,5,12,78,32,4,18,'255,230,190',1.2);add(q,()=>{q.strokeStyle='rgba(255,240,220,.5)';q.lineWidth=2;for(let i=0;i<3;i++){q.beginPath();q.moveTo(8,40+i*6);q.lineTo(26,38+i*6);q.stroke()}})},
'กายวัชระ':q=>{bg(q,'#6a3a0a','#0a0402','255,190,90',hash('i2'));glow(q,48,50,40,'255,200,100',.65);
 add(q,()=>{q.strokeStyle='rgba(255,220,140,.9)';q.lineWidth=2.2;q.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6-Math.PI/2;q.lineTo(48+Math.cos(a)*36,50+Math.sin(a)*36)}q.closePath();q.stroke();q.lineWidth=1;q.beginPath();for(let i=0;i<6;i++){const a=i*TAU/6;q.lineTo(48+Math.cos(a)*30,50+Math.sin(a)*30)}q.closePath();q.stroke()});
 q.fillStyle='rgba(50,20,4,.85)';q.beginPath();q.ellipse(48,64,16,14,0,Math.PI,TAU);q.lineTo(64,72);q.lineTo(32,72);q.closePath();q.fill();q.beginPath();q.arc(48,42,8,0,TAU);q.fill();
 add(q,()=>{q.strokeStyle='rgba(255,230,160,.9)';q.lineWidth=1.4;q.beginPath();q.arc(48,42,9,0,TAU);q.stroke();q.beginPath();q.moveTo(26,72);q.quadraticCurveTo(48,62,70,72);q.stroke()});
 const g=q.createLinearGradient(40,26,56,30);g.addColorStop(0,'#fff4c0');g.addColorStop(1,'#c88a20');q.fillStyle=g;q.beginPath();q.moveTo(48,18);q.lineTo(54,26);q.lineTo(48,34);q.lineTo(42,26);q.closePath();q.fill();sparks(q,40,20,48,50,40,'255,230,160')},
'หมัดเทพสังหาร':q=>{bg(q,'#6a2a0a','#0a0402','255,150,60',hash('i3'));
 add(q,()=>{q.save();q.translate(58,40);q.rotate(-.6);for(let i=0;i<3;i++){q.strokeStyle=`rgba(255,${190-i*40},80,${.75-i*.2})`;q.lineWidth=9-i*2.5;q.beginPath();q.moveTo(-50,8);q.bezierCurveTo(-30,-18,-12,22,8,0);q.stroke()}
  q.fillStyle='rgba(255,220,140,.9)';q.beginPath();q.moveTo(8,-8);q.lineTo(24,0);q.lineTo(8,8);q.lineTo(12,0);q.closePath();q.fill();q.restore()});
 glow(q,64,34,30,'255,190,90',.9);fist(q,62,36,1.05);shock(q,64,34,22,22,'255,220,150',2);streaks(q,7,18,64,34,22,40,'255,220,150',1.4)},
// 🐉 อัศวินมังกร
'ทวนบูมเมอแรง':q=>{bg(q,'#5a1a1a','#080202','255,110,90',hash('j1'));
 add(q,()=>{q.strokeStyle='rgba(255,140,110,.55)';q.lineWidth=3;q.setLineDash([5,4]);q.beginPath();q.ellipse(48,48,36,20,-.5,0,TAU);q.stroke();q.setLineDash([])});
 add(q,()=>{q.globalAlpha=.3;spear(q,38,56,-.5+.3,70);q.globalAlpha=.55;spear(q,44,52,-.5+.15,70)});q.globalAlpha=1;spear(q,44,54,-.5,70);glow(q,74,34,14,'255,200,170',.8)},
'ผิวเกล็ดมังกร':q=>{bg(q,'#6a1a0a','#0a0202','255,120,60',hash('j2'));
 q.save();q.beginPath();q.moveTo(48,14);q.quadraticCurveTo(82,22,78,50);q.quadraticCurveTo(72,76,48,86);q.quadraticCurveTo(24,76,18,50);q.quadraticCurveTo(14,22,48,14);q.clip();scales(q,10,12,84,80,'#ff9a5a','#5a0a04');q.restore();
 q.strokeStyle='#2a0602';q.lineWidth=2;q.beginPath();q.moveTo(48,14);q.quadraticCurveTo(82,22,78,50);q.quadraticCurveTo(72,76,48,86);q.quadraticCurveTo(24,76,18,50);q.quadraticCurveTo(14,22,48,14);q.stroke();
 add(q,()=>{flame(q,18,72,10);flame(q,78,70,11);flame(q,48,90,9)});glow(q,40,34,18,'255,220,170',.45)},
'ร่วงจากนภา':q=>{bg(q,'#5a1a0a','#080202','255,120,50',hash('j3'));
 const v=q.createLinearGradient(0,60,0,96);v.addColorStop(0,'#3a1a0a');v.addColorStop(1,'#1a0602');q.fillStyle=v;q.beginPath();q.moveTo(0,96);q.lineTo(30,64);q.lineTo(66,64);q.lineTo(96,96);q.fill();
 add(q,()=>{flame(q,48,70,16);glow(q,48,66,30,'255,160,60',.8)});beam(q,48,0,48,58,7,'255,150,70','rgba(255,240,210,.95)');
 spear(q,48,30,Math.PI/2,56,{c:'#ffe8d8'});rocks(q,22,12,48,82,80,'#3a1a0a');sparks(q,25,30,48,62,30,'255,190,90')},
// 🐺 ผู้อัญเชิญ
'แตรสั่งโจมตี':q=>{bg(q,'#3a5a1a','#040802','200,255,120',hash('k1'));
 add(q,()=>{for(let i=0;i<4;i++){q.strokeStyle=`rgba(220,255,160,${.75-i*.17})`;q.lineWidth=2.4;q.beginPath();q.arc(56,40,12+i*9,-1,.9);q.stroke()}});horn(q,36,58,-.55,1.25);glow(q,64,36,20,'220,255,160',.5)},
'เต่าผู้พิทักษ์':q=>{bg(q,'#2a4a2a','#020602','150,220,140',hash('k2'));shock(q,46,70,40,10,'200,255,170',3);glow(q,46,48,32,'190,255,160',.4);shell(q,44,62,1.15);rocks(q,6,8,46,82,80,'#3a3a24')},
'พญานาคราช':q=>{bg(q,'#1a4a5a','#02080a','120,230,240',hash('k3'));
 add(q,()=>{q.save();q.translate(66,30);q.rotate(.3);for(let i=0;i<3;i++){q.fillStyle=`rgba(140,230,255,${.45-i*.12})`;q.beginPath();q.moveTo(0,0);q.arc(0,0,44-i*8,-.4,.5);q.closePath();q.fill()}q.restore()});
 const R=rng(12);for(let i=0;i<14;i++){q.fillStyle='rgba(220,250,255,.85)';q.beginPath();q.arc(74+R()*20,32+R()*30,.8+R()*1.6,0,TAU);q.fill()}serpent(q,44,56,1.15)},
};
for(const k in D){const f=D[k];D[k]=(q,S)=>{q.save();q.scale(S/96,S/96);q.lineCap='round';q.lineJoin='round';try{f(q)}finally{finish(q)}q.restore()}}
return D})();
if(typeof SKART!=='undefined')for(const n in I41)SKART[n]=I41[n];
