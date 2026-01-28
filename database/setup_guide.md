# 📋 Nong Om - คู่มือติดตั้ง Backend

## ขั้นตอนที่ 1: ตั้งค่า Supabase

### 1.1 เปิด SQL Editor
1. ไปที่ https://supabase.com/dashboard/project/boftmraerrwurznfacgr
2. ที่เมนูซ้าย คลิก **SQL Editor**
3. คลิก **+ New Query**

### 1.2 รัน SQL Script
1. เปิดไฟล์ `supabase_setup.sql`
2. **คัดลอกทั้งหมด** (Ctrl+A → Ctrl+C)
3. วางใน SQL Editor (Ctrl+V)
4. คลิก **Run** (หรือกด Ctrl+Enter)
5. รอจนแสดง "Success"

### 1.3 ตรวจสอบ
1. ไปที่ **Table Editor** (เมนูซ้าย)
2. ควรเห็นตารางเหล่านี้:
   - profiles
   - category_limits
   - savings_goals
   - privacy_settings
   - friendships
   - monthly_summaries

---

## ขั้นตอนที่ 2: ตั้งค่า N8N

### 2.1 Import Workflow
1. ไปที่ https://kawoat9.app.n8n.cloud/workflow/CdZ4HALjCK8NU_yR7I_ZL
2. คลิกปุ่ม **...** (ตัวเลือก) → **Import from File**
3. เลือกไฟล์ `n8n_workflow.json`
4. คลิก **Import**

### 2.2 ตั้งค่า Credentials

#### Gemini API Key:
1. คลิก Node **Gemini Vision**
2. ที่ **Credentials** → คลิก **Create New**
3. เลือก **HTTP Query Auth**
4. ใส่:
   - **Name**: `Gemini API Key`
   - **Parameter Name**: `key`
   - **Parameter Value**: `AIzaSyDLed63Mkow-sOCH4b3KmioSNBx1GR_KXw`
5. คลิก **Save**

#### Google Sheets:
1. คลิก Node **Google Sheets**
2. ที่ **Credentials** → คลิก **Create New**
3. เลือก **Google Sheets OAuth2**
4. ทำตามขั้นตอน Google OAuth (Login ด้วย Google Account)
5. คลิก **Save**

### 2.3 Activate Workflow
1. คลิกปุ่ม **Active** (มุมขวาบน) ให้เป็นสีเขียว
2. จด **Webhook URL** (คลิก Node Webhook → ดู Production URL)
   - URL จะเป็นแบบ: `https://kawoat9.app.n8n.cloud/webhook/nongom-ocr`

---

## ขั้นตอนที่ 3: ตั้งค่า Google Sheets

### 3.1 เปิด Sheet
1. ไปที่ https://docs.google.com/spreadsheets/d/1lfaYmNjYD0sBi6Gzt30xuxhBs4tXqcjdWTTY0Dz9e3I

### 3.2 เพิ่ม Header Row
ที่ Row 1 ใส่ข้อความต่อไปนี้ในแต่ละ Column:

| Column | Header |
|--------|--------|
| A1 | user_id |
| B1 | type |
| C1 | category_id |
| D1 | amount |
| E1 | description |
| F1 | date |
| G1 | source |

### 3.3 Share กับ N8N
1. คลิก **Share** (มุมขวาบน)
2. ใส่ email ของ Google Account ที่ใช้กับ N8N
3. ให้สิทธิ์ **Editor**

---

## ขั้นตอนที่ 4: ใช้งาน Lovable

### 4.1 สร้างโปรเจค Lovable
1. ไปที่ https://lovable.dev
2. สร้าง Project ใหม่
3. คัดลอก Prompt จากไฟล์ `lovable_prompt.md`
4. วางใน Lovable และ Generate

### 4.2 ใส่ Supabase Credentials
เมื่อ Lovable ถามหา Supabase:
- **Project URL**: `https://boftmraerrwurznfacgr.supabase.co`
- **Anon Key**: (ไปหาที่ Supabase Dashboard → Settings → API → anon public)

---

## ✅ เสร็จสิ้น!

เมื่อทำครบทุกขั้นตอน ระบบจะทำงานดังนี้:

```
ผู้ใช้ → Lovable (Frontend)
          ↓
      Supabase (Login/Signup)
          ↓
      N8N → Gemini (OCR)
          ↓
      Google Sheets (เก็บข้อมูล)
          ↓
      Lovable (แสดงเมืองตึก)
```

---

## 🔧 แก้ปัญหา

### ปัญหา: Login ไม่ได้
- ตรวจสอบ Supabase URL และ Anon Key

### ปัญหา: OCR ไม่ทำงาน
- ตรวจสอบว่า N8N Workflow Active อยู่
- ตรวจสอบ Gemini API Key

### ปัญหา: ข้อมูลไม่บันทึก
- ตรวจสอบว่า Google Sheets Share กับ N8N แล้ว
- ตรวจสอบ Header Row ใน Sheet
