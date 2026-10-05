# ตำนานเอลโดเรีย v4.8 — โครงสร้างสถาปัตยกรรม

## ภาพรวม
เกมแบ่งเป็น 3 ชั้น:

| ชั้น | อยู่ที่ไหน | หน้าที่ |
|---|---|---|
| **โมดูลใหม่** | `modules/` | `GAME_DATABASE`, EventBus, Guard, หน้าโหลด, ดันเจี้ยนไม่สิ้นสุด, อีเวนต์ และตัวตรวจระบบ |
| **แพตช์** | `patches/v46a–k.js` | ฟีเจอร์ที่เพิ่มไว้ในเวอร์ชัน 4.6–4.7.8 |
| **เอนจินเดิม** | อยู่ใน `game_built.html` | วาดภาพ ฟิสิกส์ แผนที่ และระบบพื้นฐาน |

ตอนส่งออก ทุกไฟล์จะถูกรวมเป็น HTML ไฟล์เดียว เพราะ APK และ Artifact ต้องการแบบนั้น (CSP ของ APK ไม่อนุญาตให้โหลดสคริปต์จากไฟล์แยก)

## โมดูล (ลำดับการโหลด)
1. `core.js`
   - `EventBus` (`on` / `off` / `once` / `emit`) และรายชื่อเหตุการณ์ `EV`
   - `Hooks` (ตัวกรองค่า) และ `PSTATE` (`isCasting` / `isInteracting` / `isEquipping` / `inTransition`)
   - `Guard.run()` (try / catch / finally), `LoadingScreenManager` และทางเข้ารวม `Eldoria.modules`
2. `config.js`
   - **GAME_DATABASE** — แก้ไฟล์นี้ไฟล์เดียวเพื่อเพิ่มเนื้อหา
3. `monsters.js`
   - สร้างมอนจากฐานข้อมูล, สเกลตามชั้น, ค่าเกราะ (def), ตารางดรอป, `MONSTER_DIED`, `SPAWN_REQUEST`
4. `dungeons.js`
   - ช่วงชั้น → มอน / บอส / รางวัล, ชั้นไม่สิ้นสุด และหน้าโหลดตอนลงชั้น (`dgGo7`)
5. `player.js`
   - XP ผ่าน `Hooks('xp')`, `XP_GAINED` / `LEVEL_UP` และสวมใส่ผ่าน Guard (`ITEM_EQUIPPED`)
6. `skills.js`
   - ใช้สกิล/อัลติผ่าน Guard (`isCasting`, `SKILL_CAST`) และตัวกันสตันค้าง
7. `events.js`
   - `EventSystem`: EXP / เหรียญ / ดรอป ×N, มอนพิเศษ, บอสตามฤดูกาล และร้านอีเวนต์
8. `ui.js`
   - ห่อการเปิด/ปิดหน้าต่าง (`UI_OPEN` / `UI_CLOSE`), ป้ายอีเวนต์บน HUD, ร้านอีเวนต์ และแผง GM
9. `validator.js`
   - `SystemValidator.runChecks()` ทำงานอัตโนมัติหลังโหลดเกม 3 วินาที
   - เรียกเองได้ด้วย `runChecks({ui:true})`

## เพิ่มเนื้อหาโดยแก้แค่ `config.js`

**มอนใหม่** — ใส่ใน `CUSTOM_MONSTERS`:
```js
{id:'lava_wolf', name:'หมาป่าลาวา', family:'wolf', colors:['#ff6a2a','#5a1a08','#ffe24a'],
 stats:{hp:1.2, atk:1.3, def:.1, speed:90}, dropTableId:'endless_common', spawnIn:['copper']}
```
- `family` คือรูปร่างที่มีอยู่แล้ว: beetle, bat, golem, wolf, wisp, dragon, skeleton, zombie, drake
- `stats.hp` / `stats.atk` เป็นตัวคูณกับสูตรตามเลเวล
- `def` ลดดาเมจที่รับเป็นสัดส่วน
- เกิดในโซน: `spawnIn:['iron']`
- เกิดในดันเจี้ยน: ใส่ `id` ใน `DUNGEON_CONFIG.bands[].monsterSpawns` แล้วใส่ `floors:[จาก,ถึง]`

**ชั้นดันเจี้ยน** — แก้ใน `DUNGEON_CONFIG`:
- `maxFloor` คือชั้นสูงสุด
- `bands` คือช่วงชั้นและมอนที่เกิด
- `endless` คืออัตราสเกล HP / ATK / เกราะ / รางวัลต่อชั้น

**ดรอป** — แก้ใน `LOOT_TABLES`:
```js
{rolls:[{item:'estone', chance:.25, min:1, max:2}]}
```

**อีเวนต์** — แก้ใน `EVENTS`:
- เปิด/ปิดด้วย `active:true/false`
- ตัวคูณ: `multiplier:{xp, coin, drop}`
- มอนพิเศษ: `specialSpawns`
- บอสตามฤดูกาล: `seasonalBossId` + `seasonalBossEverySec`
- ร้านอีเวนต์: `eventShopId` → ระบุร้านใน `SHOPS_EXTRA` (ใช้ `host` เพื่อบอกว่าจะขึ้นในร้านไหน)

**ไอเท็ม / วัตถุดิบใหม่**:
- `ITEMS_EXTRA` สร้างไอเท็มใหม่จากไอเท็มต้นแบบด้วย `base`
- `MATS_EXTRA` สำหรับวัตถุดิบใหม่

หลังแก้แล้ว ให้กด GM → 🧪 **SystemValidator** หรือรัน `node tests/system_validator.test.js` ตัวตรวจจะเช็กว่า id ซ้ำหรือไม่ อ้างถึงมอน / ร้าน / ของที่ไม่มีอยู่หรือไม่ ช่วงชั้นต่อเนื่องหรือไม่ และหน้าต่างปิดได้ครบหรือไม่

## เหตุการณ์มาตรฐาน (EventBus)

**มอน**
- `MONSTER_SPAWNED`, `MONSTER_DIED`, `BOSS_DIED`, `LOOT_DROPPED`

**ผู้เล่นและสกิล**
- `XP_GAINED`, `LEVEL_UP`, `ITEM_EQUIPPED`
- `SKILL_CAST`, `SKILL_FAILED`

**ดันเจี้ยนและเควส**
- `DUNGEON_FLOOR_ENTER`, `DUNGEON_FLOOR_CLEARED`, `QUEST_CLAIMED`

**หน้าต่างและอีเวนต์**
- `UI_OPEN`, `UI_CLOSE`, `EVENT_STARTED`, `EVENT_ENDED`

**ระบบ**
- `ERROR`, `VALIDATED`, `SPAWN_REQUEST`

ตัวอย่าง:
```js
EventBus.on(EV.MONSTER_DIED, d => { if (d.id === 'frost_skeleton') say('ได้รับความหนาวเย็น!') }, 'mymodule');
```
ถ้าตัวฟังตัวหนึ่งพัง ระบบจะจับไว้และไม่กระทบตัวฟังอื่น

## ข้อจำกัดที่ควรรู้
- ระบบเดิม (วาดภาพ ฟิสิกส์ สกิลแต่ละท่า) ยังอยู่ในเอนจินเดิม โมดูลใหม่ทำงานโดยห่อระบบเหล่านั้นไว้ ไม่ได้เขียนใหม่ จึงไม่กระทบเซฟและระบบออนไลน์
- สกิลท่าใหม่ยังต้องเขียนโค้ดท่าทางเอง ส่วนตัวเลขของสกิล (มานา / คูลดาวน์) ปรับได้ใน `SKILL_OVERRIDES`
- มอนใหม่ต้องใช้รูปร่างที่มีอยู่แล้ว (เปลี่ยนสี / ชื่อ / ค่าพลังได้) ถ้าต้องการรูปร่างใหม่ต้องเพิ่มโค้ดวาดเอง
