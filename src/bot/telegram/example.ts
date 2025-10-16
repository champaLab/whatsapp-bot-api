/**
 * ตัวอย่างการใช้งาน Telegram Service
 * 
 * ไฟล์นี้แสดงวิธีการใช้งาน TelegramService และ QRCodeGenerator
 * สำหรับการส่งข้อความและรูปภาพไปยัง Telegram
 */

import { telegramService } from './telegram.config';
import { qrCodeGenerator } from './qr-generator';

// ตัวอย่างการส่งข้อความ
export const sendTestMessage = async () => {
    try {
        const success = await telegramService.sendMessage('🧪 ทดสอบการส่งข้อความจาก WhatsApp Bot API');
        if (success) {
            console.log('✅ ข้อความส่งสำเร็จ');
        } else {
            console.log('❌ ข้อความส่งไม่สำเร็จ');
        }
    } catch (error) {
        console.error('❌ Error sending test message:', error);
    }
};

// ตัวอย่างการสร้างและส่ง QR Code
export const sendTestQRCode = async () => {
    try {
        // สร้าง QR Code ตัวอย่าง
        const testQRString = 'https://example.com/whatsapp-qr-test';

        // สร้างรูปภาพ QR Code
        const qrImagePath = await qrCodeGenerator.generateQRImage(testQRString);

        if (qrImagePath) {
            // ส่งรูปภาพไปยัง Telegram
            const success = await telegramService.sendPhoto(
                qrImagePath,
                '🧪 QR Code ทดสอบ\n\nนี่คือ QR Code ตัวอย่างสำหรับการทดสอบระบบ'
            );

            if (success) {
                console.log('✅ QR Code ส่งสำเร็จ');
            } else {
                console.log('❌ QR Code ส่งไม่สำเร็จ');
            }
        } else {
            console.log('❌ ไม่สามารถสร้าง QR Code ได้');
        }
    } catch (error) {
        console.error('❌ Error sending test QR code:', error);
    }
};

// ตัวอย่างการตรวจสอบสถานะ
export const checkTelegramStatus = () => {
    const isReady = telegramService.isReady();
    console.log(`📱 Telegram Bot Status: ${isReady ? 'Ready' : 'Not Ready'}`);
    return isReady;
};

// ตัวอย่างการตั้งค่า Chat ID
export const setTelegramChatId = (chatId: string) => {
    telegramService.setChatId(chatId);
    console.log(`📝 Chat ID updated to: ${chatId}`);
};

// ตัวอย่างการล้างไฟล์ QR Code เก่า
export const cleanupQRFiles = async () => {
    try {
        await qrCodeGenerator.cleanupOldQRCodes();
        console.log('🗑️ QR Code files cleaned up');
    } catch (error) {
        console.error('❌ Error cleaning up QR files:', error);
    }
};

// ตัวอย่างการใช้งานทั้งหมด
export const runAllExamples = async () => {
    console.log('🚀 เริ่มทดสอบ Telegram Integration...');

    // ตรวจสอบสถานะ
    if (!checkTelegramStatus()) {
        console.log('❌ Telegram Bot ไม่พร้อมใช้งาน กรุณาตรวจสอบการตั้งค่า');
        return;
    }

    // ส่งข้อความทดสอบ
    await sendTestMessage();

    // รอ 2 วินาที
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ส่ง QR Code ทดสอบ
    await sendTestQRCode();

    // รอ 2 วินาที
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ล้างไฟล์เก่า
    await cleanupQRFiles();

    console.log('✅ การทดสอบเสร็จสิ้น');
};

// ใช้งานเมื่อเรียกไฟล์นี้โดยตรง
if (require.main === module) {
    runAllExamples().catch(console.error);
}
