// ทดสอบสกิลใหม่ของมังค์ในเหมือง: ดาเมจ / คูลดาวน์ / กายวัชระลดดาเมจ
P.lv=120;P.cls='monk';recalcStats();P.hp=BAL.hp;P.mp=BAL.mp;
const sl=ms=>new Promise(r=>setTimeout(r,ms));
enterZone(0);await sl(2500);
const out={scene:netScene(),mobs:(D.mobs||[]).length};
const pull=(n,dx)=>{const M=(D.mobs||[]).filter(m=>!m.dead).slice(0,n);M.forEach((m,k)=>{m.x=P.x+dx+(k%3)*14;m.y=P.y+(k>>1)*10-8;m.hp=m.mhp||m.hp});return M};
const hp=M=>M.map(m=>Math.round(m.hp));
let M=pull(4,120);let b=hp(M);P.mp=BAL.mp;useSkill(3);await sl(150);out.s4={before:b,after:hp(M),cd:+CS.cd[3].toFixed(2)};
await sl(700);
P.mp=BAL.mp;useSkill(4);await sl(100);out.s5={vajra:!!B41.vajra,cd:+CS.cd[4].toFixed(1)};const h0=P.hp;P.hp-=200;await sl(150);out.s5.healBack=Math.round(P.hp-(h0-200));
await sl(700);
M=pull(5,90);b=hp(M);P.dir='r';P.mp=BAL.mp;useSkill(5);await sl(200);out.s6charging=!!B41.charge;await sl(330);
window.__shot=1;await sl(10);
out.s6mid=hp(M);await sl(700);out.s6={before:b,after:hp(M),cd:+CS.cd[5].toFixed(1)};
out.combo=B41.combo;return out
