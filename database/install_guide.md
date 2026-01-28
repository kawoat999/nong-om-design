# วิธีเชื่อมต่อ Google Sheets (แบบจับมือทำ)

เพื่อให้หน้าเว็บคุยกับ Sheet ของคุณได้ เราจะติดตั้ง "โค้ดหลังบ้าน" ลงบน Sheet นั้นครับ

## 1. เปิด Script Editor
1. ไปที่ Google Sheet ของคุณ: [Link](https://docs.google.com/spreadsheets/d/1lfaYmNjYD0sBi6Gzt30xuxhBs4tXqcjdWTTY0Dz9e3I/edit)
2. เมนูบนสุด เลือก **Extensions (ส่วนขยาย)** > **Apps Script**

## 2. ใส่โค้ด
1. ลบโค้ดเก่าในไฟล์ `Code.gs` ออกให้หมด
2. ก๊อปปี้โค้ดจากไฟล์ `backend.gs` ที่ผมให้ไป (ดูใน Chat หรือ Artifact) มาวางแทนที่
3. กด 💾 **Save** (รูปแผ่นดิสก์) ตั้งชื่อว่า "API" ก็ได้ครับ

## 3. สั่ง Deploy (สำคัญมาก!)
1. มุมขวาบน กดปุ่ม **Deploy** (สีน้ำเงิน) > **New deployment**
2. ตรง `Select type` (รูปเฟือง) > เลือก **Web app**
3. ตั้งค่าตามนี้:
   - **Description**: `Version 1`
   - **Execute as**: `Me (อีเมลคุณ)` (**ห้ามเลือก User accessing the web app**)
   - **Who has access**: `Anyone` (**สำคัญ! ต้องเลือก Anyone เพื่อให้เว็บเราเข้าถึงได้**)
4. กด **Deploy**
5. มันอาจจะถามหา Permission ให้กด **Review permissions** > เลือกอีเมล > Advanced > Go to API (unsafe) > Allow

## 4. เอา URL มาใส่
1. เมื่อ Deploy เสร็จ คุณจะได้ **Web App URL** (ยาวๆ ที่ลงท้ายด้วย `/exec`)
2. ก๊อปปี้ URL นั้นส่งมาให้ผม หรือเอาไปใส่ในโค้ดส่วน `services` ครับ

จบขั้นตอนครับ! 🎉
