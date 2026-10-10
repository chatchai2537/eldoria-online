// วัดว่าพาสซีฟ "สายตรง" (p4→คีย์สโตน K) กับ "สายแยก 2 ทาง" (bL→N1 / bR→N2) ให้ค่าต่างกันเท่าไรต่อ 2 แต้มเท่ากัน ทุกอาชีพที่ Lv.80
// ใช้: TOUCH=0 node tools/run-game.js game_built.html out 900 500 @tools/scenarios/passive-paths.js  (ดู K / L / R = % ที่เพิ่มจากฐาน: atk=ตีธรรมดา hp crit)
const CL=['sword','paladin','dragoon','monk','ninja','archer','sniper','summoner','necro','mage','cleric'],MAIN={sword:'str',paladin:'vit',dragoon:'str',monk:'str',ninja:'agi',archer:'agi',sniper:'agi',summoner:'int',necro:'int',mage:'int',cleric:'int'};
const out={};const LV=80;
const meas=()=>{recalcStats();const x=PTX();return {atk:Math.round(clsAtk()),hp:BAL.hp,crit:+critCh().toFixed(3),dmg:x.dmg,skill:x.skill,aspd:x.aspd,area:x.area,dr:x.dr,cdr:x.cdr,mdmg:x.mdmg,minion:x.minion,spd:x.spd}};
for(const c of CL){P.cls=c;P.lv=LV;try{const w=NEEDW[c]+3;GEAR[w]=1;P.armor.sword=w;syncSword()}catch(e){}
 const pts=(LV-1)*3;P.stats={str:10,agi:10,int:10,vit:10,end:10};P.stats[MAIN[c]]+=Math.round(pts*.6);P.stats.vit+=Math.round(pts*.25);P.stats.end+=Math.round(pts*.15);
 const base=['c0','S_'+c,'p1_'+c,'p2_'+c,'w0_'+c,'w1_'+c,'w2_'+c,'w3_'+c,'N0_'+c,'p3_'+c];const inn=PNODES['S_'+c].adj.find(a=>a.startsWith('in'));base.push(inn);
 const set=a=>{PT.a=new Set(a);ptDirty()};
 set(base);const b=meas();set(base.concat(['p4_'+c,'K_'+c]));const k=meas();set(base.concat(['bL_'+c,'N1_'+c]));const l=meas();set(base.concat(['bR_'+c,'N2_'+c]));const r=meas();
 const d=(m)=>({atk:+((m.atk/b.atk-1)*100).toFixed(1),hp:+((m.hp/b.hp-1)*100).toFixed(1),crit:+((m.crit-b.crit)*100).toFixed(1)});
 out[c]={base:b,K:d(k),L:d(l),R:d(r),stats:Object.assign({},P.stats)}}
return out
