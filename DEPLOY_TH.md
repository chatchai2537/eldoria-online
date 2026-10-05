# อัปเดตเว็บ + เปิดเซิร์ฟเวอร์ออนไลน์ (เวอร์ชัน 4.9)

## A) อัปโหลดไฟล์ขึ้น GitHub
อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ไปไว้ที่ชั้นนอกสุดของ repo `chatchai2537/eldoria-online` (ทับของเดิม):
- index.html, game_built.html — ตัวเกม
- manifest.webmanifest, sw.js, icon-192.png, icon-512.png — ทำให้กดติดตั้งลงหน้าจอหลักได้
- server.js, package.json, render.yaml — เซิร์ฟเวอร์ออนไลน์ (GitHub Pages ไม่ได้ใช้ไฟล์เหล่านี้ แต่ Render จะใช้)

## B) เปิดเซิร์ฟเวอร์ฟรีที่ Render (ทำครั้งเดียว ประมาณ 5 นาที)
1. เข้า https://render.com แล้วกด **Get Started** จากนั้นเลือก **Sign in with GitHub**
2. ในหน้า Dashboard กด **New +** แล้วเลือก **Blueprint**
3. เลือก repo **eldoria-online** แล้วกด **Apply**
4. รอ 2–3 นาทีจนขึ้น **Live** ระบบจะให้ลิงก์มา เช่น `https://eldoria-online.onrender.com`
5. ถ้าลิงก์ที่ได้ **ไม่ใช่** `eldoria-online.onrender.com` (เช่นมีตัวอักษรต่อท้าย) ให้แก้บรรทัดนี้ใน index.html แล้วอัปโหลดขึ้นอีกครั้ง:
   `<meta name="eldoria-server" content="wss://ชื่อที่ได้.onrender.com">`

หลังจากนั้น เปิดเกมจาก https://chatchai2537.github.io/eldoria-online/ เกมจะต่อเซิร์ฟเวอร์ให้เอง

หมายเหตุ: Render แบบฟรีจะหลับเมื่อไม่มีคนเล่น 15 นาที คนแรกที่เข้ามาต้องรอประมาณ 30 วินาทีให้เซิร์ฟเวอร์ตื่น

## ห้ามอัปโหลด
- `eldoria_release_key.pem`, `EldoriaBuildKit.zip`, `*.apk`
- กุญแจ GM (เก็บไว้ในแชทหรือที่ส่วนตัวเท่านั้น)
