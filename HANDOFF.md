# 🤝 HANDOFF — สถานะงานล่าสุด + งานค้าง (อ่านไฟล์นี้ก่อน เพื่อประหยัดโควต้า)

> อัปเดต: 2026-10-09 (v4.49 ขึ้นเกมจริงแล้ว) · เขียนโดย Claude (เซสชันที่ทำ v4.46–v4.49)
> **กฎ: AI ทุกตัวที่ทำงานเสร็จ ต้องอัปเดตไฟล์นี้ (หัวข้อ 1–2) ก่อน push** — เจ้าของเกมต้องการให้ AI คนถัดไปทำต่อได้ทันที
> รายละเอียดเชิงลึก/กฎเหล็กอยู่ที่ [`AI_GUIDE.md`](./AI_GUIDE.md) — ไฟล์นี้คือ "ทางลัด" ไม่ใช่ตัวแทน

---

## 1. สถานะตอนนี้

| อะไร | สถานะ |
|---|---|
| เกมที่ผู้เล่นเห็น (`main` → GitHub Pages) | **v4.49** (ล่าสุด: fix44 สมุนอัญเชิญมีเลือด/ตายได้/ดาเมจสมดุล) |
| รอเจ้าของอนุมัติ | — ไม่มี |
| เซิร์ฟเวอร์ Render | deploy ล่าสุด = v4.47 (AOI ส่งเฉพาะคนใกล้) · `/api/ping` = `store:upstash` ✓ |

แพตช์ที่ทำในรอบนี้ (ต่อท้าย `game_built.html` ตามกฎ): **fix41** 6 สกิล+ปุ่มมือถือวงคู่+ไอคอน I41+สกิลมังค์ · **fix42** คราฟอาวุธอาชีพ/หอคอยในเมือง/แมพป่า 3 แมพ · **fix43** ระยะโจมตีตามบทบาท · **fix44** สมุน

## 2. งานค้าง (เรียงตามความสำคัญ)

> เจ้าของสั่ง: ทำของใหม่เป็นแพตช์ต่อท้ายเท่านั้น **ห้ามยุ่ง/รื้อระบบเดิม**

1. **สกิลใหม่ช่อง 4–6 + พาสซีฟเสริมสกิล ของอีก 10 อาชีพ** — ออกแบบและอนุมัติแล้ว ตัวเลขครบใน [`design/skills-plan.json`](./design/skills-plan.json) (ดูภาพรวมสวย ๆ: `design/skill-design.html`) · ไอคอนทุกท่ามีในเกมแล้ว (`I41` → `SKART` ตามชื่อสกิล) · ทำแล้ว: monk · วิธีทำ → หัวข้อ 3
2. นักดาบ (และสายประชิด) ตีธรรมดา DPS ต่ำ (~115 vs สายเวท ~300 ที่ Lv.80) — วัดด้วย `tools/scenarios/dps.js`
3. เอฟเฟกต์สกิลใหม่ (fix41) ผู้เล่นอื่นยังไม่เห็น (ต้องส่งผ่าน `FX34`/`sx k:'fx'`) · สกิลใหม่ยังไม่โดนผู้เล่นใน PvP
4. ป้ายชื่อโซน "เมืองเอลโดเรีย/วิหารแห่งแสง" ทับชื่อตัวละคร (วาดบน canvas) — ควรจางหายหลัง 3 วิ
5. ราคาเรียนสกิล 4–6 (แบบเดิมเสนอ 5,000/12,000/30,000 🪙) — ตอนนี้ปลดล็อกฟรีตามเลเวลเหมือนสกิลอาชีพเดิม **รอเจ้าของตัดสิน**
6. ผู้เล่น 1,000 คนพร้อมกันจริง ต้องอัปเกรด Render แบบเสียเงิน (เทสในเครื่อง: 1,000 บอท ~8 snap/วิ, ~110KB/วิ/คน)

## 3. สูตรเพิ่มสกิลช่อง 4–6 ให้อาชีพ (ทำตาม fix41 ของมังค์)

ทำเป็นแพตช์ใหม่ `fix45…` ต่อท้าย (ก่อน `</body>`) — **อย่าแก้ fix41**:
```js
// 1) ข้อมูล: ต่อท้ายรายการ 3 ท่าเดิม (ดัชนี 3,4,5 = ช่อง 4,5,6) — ชื่อ n ต้องตรงกับ design/skills-plan.json (ไอคอนจับคู่ด้วยชื่อ)
CSKILLS.sword.length=3; CSKILLS.sword.push({n:'ทะยานดาบ',e:'⚡',lv:50,price:5000,mp:20,cd:8,new:1,d:'...'}, ...);
// 2) ฟังก์ชันท่า: useSkill(i>=3) เรียก NEWSK[cls][i-3]() · คืน false = ไม่ร่าย (ไม่เสียมานา/คูลดาวน์)
NEWSK.sword=[()=>{...},()=>{...},()=>{...}];
// 3) พาสซีฟเสริมสกิล: ใส่ใน PASSIVE[cls] พร้อม sk41:1 แล้ว sort ตาม lv (ดูโค้ด PAS41 ใน fix41)
// 4) ช่องปุ่ม: SKBAR[cls]=[0,1,2,3,4,5] (fix41 ทำให้อัตโนมัติเฉพาะอาชีพที่มีสกิล >3 ตอนโหลด — ถ้าเพิ่มทีหลัง ให้ตั้งเองแล้ว saveBar())
```
ตัวช่วยที่มีในเกม (global): `enemies()` · `eachIn(x,y,r,fn)` · `hurtE(mob,mult,{kb,stun,burn,col,fx,fy})` คืนดาเมจ (0=กำแพงขวาง) · `near25(r)` · `blink25(e)` · `line25(dv,len,w,fn)` · `cone25(dv,r,ang,fn)` · `aimDir(range)` · `shoot(kind,{dv,sp,range,mult,pierce,r})` · `summon(k,n)` (สมุน `MSPEC`, ใส่ `HPF44[k]` ด้วยถ้าเพิ่มชนิดใหม่) · เอฟเฟกต์ `ef25({k:...})` (ชนิดที่วาดได้ดูใน `draw25`) · `ring25` `pt25` `rfxP` `shake` `flash` `sfx` `dmgTxt` · บัฟ/สถานะ `B25` (โล่/อวยพร) และ `B41` (ตัวอย่างบัฟลดดาเมจ `vajra` + ติ๊กใน `skTick`)
มาตรฐานระยะ (fix43): ประชิด ~67 · ทวน 105 · คทา 280 · นักเวท 300 · ธนู 360 · ไรเฟิล 440 · วงรอบตัว 70–110 · วงที่จุดเล็ง 150–240 · พุ่ง/วาร์ป 150–220
ทดสอบหลังเพิ่ม: `ranges.js` (ระยะ) + `dps.js` (ไม่ควรเกินสายอื่นมาก) + `validator.js` ต้อง `bugs: []`

## 4. เครื่องมือทดสอบ (ไม่ต้องเขียนใหม่)

ต้องมี Playwright + Chromium (`NODE_PATH=$(npm root -g)` ถ้าติดตั้งแบบ global)
```bash
TOUCH=0 node tools/run-game.js game_built.html out 1280 720 @tools/scenarios/validator.js   # ตรวจทั้งเกม ~3.5 นาที
TOUCH=0 node tools/run-game.js game_built.html rng 1000 600 @tools/scenarios/ranges.js     # ระยะทุกอาชีพ ~5 นาที
TOUCH=0 node tools/run-game.js game_built.html dps 1000 600 @tools/scenarios/dps.js         # DPS/สมุน ~4 นาที
node tools/run-game.js game_built.html phone 844 390 'P.lv=60;P.cls="monk";recalcStats();return 1'  # ภาพจอมือถือ
sh tools/loadtest/bench.sh 1000                                                               # โหลดเซิร์ฟเวอร์ (npm i ws)
```
- ถ้าตัวตรวจแจ้ง `quest-error` เมื่อเริ่มที่ Lv.120 = เป็นมาตั้งแต่ก่อน v4.46 (ไม่ใช่บั๊กจริง)
- `run-game.js` รับสคริปต์เป็นตัวหนังสือหรือ `@ไฟล์` · ใช้ `await` ได้ · `return` ค่าออกมาเป็น JSON

## 5. ประหยัดโควต้า (สำคัญ)

- **ห้าม Read `game_built.html` ทั้งไฟล์** (3 MB, บรรทัดยาวมาก) — ใช้ `grep -n -o '.\{0,80\}คำค้น.\{0,200\}' game_built.html | cut -c1-400`
- หาโค้ดด้วยชื่อ ไม่ใช่เลขบรรทัด (เลขบรรทัดเลื่อนทุกแพตช์): `grep -n '// fix4[0-9]' game_built.html` = หัวแพตช์ · `grep -n -o 'function useSkill\|const CSKILLS=\|const NSK25=\|function minTick' game_built.html`
- ค่าจริงตอนรัน ดูด้วย `run-game.js` แล้ว `return` ออกมา เร็วกว่าอ่านโค้ด
- `index.html` = `game_built.html` เสมอ (`cmp` ก่อน commit) · เปลี่ยนเลข `<title>` ทุกครั้ง

## 6. อัปขึ้นเกม (เมื่อเจ้าของบอก "อัพ")

1. ทำงานใน branch ใหม่ → push branch → รายงานเจ้าของ (ภาษาไทย) → ได้ "อัพ" แล้ว `git merge --ff-only` เข้า `main` + push
2. หน้าเว็บ: GitHub Actions deploy เองใน ~1 นาที · ตรวจ `<title>` ที่ https://chatchai2537.github.io/eldoria-online/
3. แก้ `server.js/accounts.js/pvp.js/party.js/world.js` → ต้อง Deploy Render (service `srv-db1p2qe0tbcc73bsniog`, workspace `tea-db1otge0tbcc73bs155g`) ผ่าน Render MCP `trigger_deploy` หรือปุ่ม Manual Deploy · ผู้เล่นหลุด ~1 นาที
