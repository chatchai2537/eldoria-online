# ตำนานเอลโดเรีย (Eldoria)

เกม RPG แบบเว็บ เล่นได้จากเบราว์เซอร์โดยไม่ต้องติดตั้ง

- ไฟล์เกม: [`game_built.html`](./game_built.html)
- ซอร์สและชุดทดสอบทั้งหมด: [`eldoria-source.zip`](./eldoria-source.zip)
- ภาพรวมระบบ: [`README_ARCHITECTURE.md`](./README_ARCHITECTURE.md)

## เล่นออนไลน์

เมื่อ GitHub Pages เผยแพร่สำเร็จ เปิดเกมได้ที่:

https://chatchai2537.github.io/eldoria-online/

เกมทำงานแบบ static web app; ข้อมูลเซฟเก็บไว้ในเบราว์เซอร์ของผู้เล่นแต่ละคน (localStorage) การเห็นผู้เล่นอื่น/แชทต้องเชื่อมต่อบริการห้องหรือ WebSocket ที่เกมรองรับเพิ่มเติม — GitHub Pages ให้บริการไฟล์เว็บเท่านั้น ไม่ได้รันเซิร์ฟเวอร์เกมแบบ multiplayer

## การเผยแพร่

GitHub Actions จะคัดลอก `game_built.html` เป็น `index.html` และเผยแพร่เมื่อมีการ push ไปยัง `main` ดูสถานะได้ที่แท็บ **Actions** ของ repository
