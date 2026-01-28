# N8N Configuration Guide - Nong Om OCR

## Webhook URL (สำหรับเรียกจาก App)
```
https://kawoat9.app.n8n.cloud/webhook/6aa89004-c110-48c0-b52a-38c98fbe0224
```

---

## 1. Webhook Node ✅ Done
- **Method**: POST
- **Respond**: Using 'Respond to Webhook' Node

---

## 2. HTTP Request Node ✅ Done
- **Method**: POST  
- **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- **Query Parameters**: key = AIzaSyDLed63Mkow-sOCH4b3KmioSNBx1GR_KXw
- **Send Body**: ON
- **Body Content Type**: JSON
- **Specify Body**: Using JSON
- **JSON Body**: (configured with Gemini API request structure)

---

## 3. Code Node (JavaScript)

ใส่โค้ดนี้ใน Code editor:

```javascript
// Parse Gemini OCR response
const response = $input.first().json;

let text = '';
try {
  text = response.candidates[0].content.parts[0].text;
} catch (e) {
  return [{ json: { error: 'Failed to parse Gemini response', raw: response } }];
}

// Extract JSON from response
let parsed;
try {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    parsed = JSON.parse(jsonMatch[0]);
  } else {
    parsed = { raw_text: text };
  }
} catch (e) {
  parsed = { raw_text: text };
}

// Format for Google Sheets
const now = new Date().toISOString();
return [{
  json: {
    วันที่: parsed.date || parsed.วันที่ || new Date().toLocaleDateString('th-TH'),
    รายการ: parsed.item || parsed.รายการ || parsed.description || '',
    หมวดหมู่: parsed.category || parsed.หมวดหมู่ || 'อื่นๆ',
    ประเภท: parsed.type || parsed.ประเภท || 'รายจ่าย',
    จำนวนเงิน: parsed.amount || parsed.จำนวนเงิน || 0,
    หมายเหตุ: parsed.notes || parsed.หมายเหตุ || '',
    created_at: now
  }
}];
```

---

## 4. Google Sheets Node (Append Row)

### ต้อง Configure:
1. **Credential**: ต้องเชื่อม Google Account (OAuth2)
2. **Document**: เลือก "Nong Om" spreadsheet
3. **Sheet**: Sheet1
4. **Mapping Mode**: Map Automatically / Define Below

### Columns to Map:
| Sheet Column | Value |
|--------------|-------|
| วันที่ | {{ $json.วันที่ }} |
| รายการ | {{ $json.รายการ }} |
| หมวดหมู่ | {{ $json.หมวดหมู่ }} |
| ประเภท | {{ $json.ประเภท }} |
| จำนวนเงิน | {{ $json.จำนวนเงิน }} |
| หมายเหตุ | {{ $json.หมายเหตุ }} |
| created_at | {{ $json.created_at }} |

---

## 5. Respond to Webhook Node ⚠️ ต้องแก้

### Configuration (สำคัญ!):
1. **Double-click** node นี้
2. **Respond With**: เลือก `JSON`
3. **Response Body**: คลิกที่ช่อง แล้วพิมพ์:
```
{{ $json }}
```
4. **กด Save แล้ว Publish**

หลังแก้แล้ว ลอง test ใหม่ จำนวนเงินจะแสดงถูกต้อง!

---

## สิ่งที่ต้องมี

1. **Gemini API Key** - ได้จาก https://aistudio.google.com/apikey
2. **Google OAuth สำหรับ N8N** - ต้องเชื่อม Google Account ที่มี Sheets

---

## Test Workflow

หลังจาก config ครบ:
1. กดปุ่ม **Publish** ที่มุมขวาบน
2. กดปุ่ม **Execute workflow** (สีแดง)
3. ส่ง POST request จาก Postman หรือ App ไปที่ Webhook URL
