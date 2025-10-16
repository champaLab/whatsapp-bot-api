# Telegram Integration for WhatsApp Bot

ระบบนี้จะส่งการแจ้งเตือนและ QR Code ไปยัง Telegram เมื่อ WhatsApp Bot กำลังสร้าง QR Code สำหรับการเชื่อมต่อ

## ฟีเจอร์

- 🔐 ส่ง QR Code เป็นรูปภาพไปยัง Telegram
- 📱 แจ้งเตือนสถานะของ WhatsApp Bot
- 🗑️ จัดการไฟล์ QR Code เก่าอัตโนมัติ
- ⚠️ แจ้งเตือนเมื่อเกิด error หรือ disconnection

## การตั้งค่า

### 1. สร้าง Telegram Bot

1. เปิด Telegram และค้นหา `@BotFather`
2. ส่งคำสั่ง `/newbot`
3. ตั้งชื่อ bot และ username
4. คัดลอก Bot Token ที่ได้รับ

### 2. รับ Chat ID

1. ส่งข้อความไปยัง bot ที่สร้างขึ้น
2. เปิด URL: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. คัดลอก `chat.id` จาก response

### 3. ตั้งค่า Environment Variables

เพิ่มในไฟล์ `.env`:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

## การใช้งาน

ระบบจะทำงานอัตโนมัติเมื่อ:

1. **QR Code Generation**: เมื่อ WhatsApp ต้องการสร้าง QR Code ใหม่
2. **Bot Ready**: เมื่อ WhatsApp Bot พร้อมใช้งาน
3. **Disconnection**: เมื่อ Bot ถูกตัดการเชื่อมต่อ
4. **Auth Failure**: เมื่อการยืนยันตัวตนล้มเหลว

## ไฟล์ที่เกี่ยวข้อง

- `telegram.config.ts` - การตั้งค่าและส่งข้อความไปยัง Telegram
- `qr-generator.ts` - สร้าง QR Code เป็นรูปภาพ
- `whatsapp.config.ts` - รวมการทำงานของ Telegram เข้ากับ WhatsApp Bot

## การจัดการไฟล์

- QR Code images จะถูกเก็บในโฟลเดอร์ `qr-codes/`
- ระบบจะเก็บไฟล์ QR Code ล่าสุด 5 ไฟล์เท่านั้น
- ไฟล์เก่าจะถูกลบอัตโนมัติ
