# ตำนานเอลโดเรีย (Eldoria Online)

เกม RPG ออนไลน์บนเว็บ/มือถือ (ต้องล็อกอินและต่ออินเทอร์เน็ต)

- 🎮 เล่นเกม: https://chatchai2537.github.io/eldoria-online/ (กด "📲 ติดตั้งเกมลงเครื่อง" ที่หน้าแรกเพื่อติดตั้งเป็นแอป)
- 🤖 **สำหรับ AI/นักพัฒนา: อ่าน [`AI_GUIDE.md`](./AI_GUIDE.md) ก่อนแก้ทุกครั้ง** (กฎการแก้ · โครงสร้าง · ระบบทั้งหมด · วิธี deploy · บันทึกการเปลี่ยนแปลง)
- ตัวเกม: [`game_built.html`](./game_built.html) (= `index.html`)
- เซิร์ฟเวอร์ออนไลน์ (Render): `server.js` `accounts.js` `pvp.js` `party.js` `world.js`
- เอกสารเก่า: [`README_ARCHITECTURE.md`](./README_ARCHITECTURE.md) (v4.8), [`DEPLOY_TH.md`](./DEPLOY_TH.md) (v4.9)

## การเผยแพร่
- อัป `game_built.html` + `index.html` ขึ้น `main` → GitHub Actions เผยแพร่หน้าเว็บเอง
- แก้ไฟล์เซิร์ฟเวอร์ → ต้องกด **Manual Deploy → Deploy latest commit** ใน Render เอง (Render ไม่ deploy อัตโนมัติ)
