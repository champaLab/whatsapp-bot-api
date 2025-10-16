/**
 * Telegram Debug Utilities
 * 
 * ไฟล์นี้ใช้สำหรับตรวจสอบและแก้ไขปัญหา Telegram Bot
 */

import { telegramService } from './telegram.config';
import env from '../../env';

/**
 * ตรวจสอบการตั้งค่า Telegram Bot
 */
export const checkTelegramConfiguration = () => {
  console.log('🔍 ตรวจสอบการตั้งค่า Telegram Bot...');
  
  // ตรวจสอบ Bot Token
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN ไม่ได้ตั้งค่า');
    return false;
  } else {
    console.log('✅ TELEGRAM_BOT_TOKEN ตั้งค่าแล้ว');
  }
  
  // ตรวจสอบ Chat ID
  if (!env.TELEGRAM_CHAT_ID) {
    console.error('❌ TELEGRAM_CHAT_ID ไม่ได้ตั้งค่า');
    return false;
  } else {
    console.log('✅ TELEGRAM_CHAT_ID ตั้งค่าแล้ว');
  }
  
  // ตรวจสอบรูปแบบ Bot Token
  if (!env.TELEGRAM_BOT_TOKEN.match(/^\d+:[A-Za-z0-9_-]+$/)) {
    console.error('❌ รูปแบบ TELEGRAM_BOT_TOKEN ไม่ถูกต้อง');
    console.error('   ควรเป็นรูปแบบ: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz');
    return false;
  } else {
    console.log('✅ รูปแบบ TELEGRAM_BOT_TOKEN ถูกต้อง');
  }
  
  // ตรวจสอบรูปแบบ Chat ID
  if (!env.TELEGRAM_CHAT_ID.match(/^-?\d+$/)) {
    console.error('❌ รูปแบบ TELEGRAM_CHAT_ID ไม่ถูกต้อง');
    console.error('   ควรเป็นตัวเลขเท่านั้น เช่น: 123456789');
    return false;
  } else {
    console.log('✅ รูปแบบ TELEGRAM_CHAT_ID ถูกต้อง');
  }
  
  return true;
};

/**
 * ตรวจสอบการเชื่อมต่อ Telegram Bot
 */
export const checkTelegramConnection = async () => {
  console.log('🔍 ตรวจสอบการเชื่อมต่อ Telegram Bot...');
  
  try {
    const isConnected = await telegramService.checkConnection();
    if (isConnected) {
      console.log('✅ Telegram Bot เชื่อมต่อสำเร็จ');
      return true;
    } else {
      console.error('❌ Telegram Bot เชื่อมต่อไม่สำเร็จ');
      return false;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการตรวจสอบการเชื่อมต่อ:', error);
    return false;
  }
};

/**
 * ตรวจสอบ Chat ID
 */
export const checkChatId = async () => {
  console.log('🔍 ตรวจสอบ Chat ID...');
  
  try {
    const chatId = telegramService.getChatId();
    if (!chatId) {
      console.error('❌ Chat ID ไม่ได้ตั้งค่า');
      return false;
    }
    
    console.log(`📝 Chat ID ปัจจุบัน: ${chatId}`);
    
    // ตรวจสอบว่า chat ID ถูกต้อง
    const isValid = await (telegramService as any).validateChatId();
    if (isValid) {
      console.log('✅ Chat ID ถูกต้อง');
      return true;
    } else {
      console.error('❌ Chat ID ไม่ถูกต้องหรือ Bot ยังไม่ได้เริ่มต้น');
      return false;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการตรวจสอบ Chat ID:', error);
    return false;
  }
};

/**
 * ทดสอบการส่งข้อความ
 */
export const testSendMessage = async () => {
  console.log('🧪 ทดสอบการส่งข้อความ...');
  
  try {
    const success = await telegramService.sendMessage('🧪 ทดสอบการส่งข้อความจาก WhatsApp Bot API\n\nหากคุณเห็นข้อความนี้ แสดงว่าระบบทำงานถูกต้อง!');
    
    if (success) {
      console.log('✅ การส่งข้อความสำเร็จ');
      return true;
    } else {
      console.error('❌ การส่งข้อความไม่สำเร็จ');
      return false;
    }
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการส่งข้อความ:', error);
    return false;
  }
};

/**
 * ตรวจสอบทั้งหมด
 */
export const runFullDiagnostic = async () => {
  console.log('🚀 เริ่มการตรวจสอบระบบ Telegram Bot...\n');
  
  const results = {
    configuration: false,
    connection: false,
    chatId: false,
    sendMessage: false
  };
  
  // ตรวจสอบการตั้งค่า
  results.configuration = checkTelegramConfiguration();
  console.log('');
  
  if (!results.configuration) {
    console.log('❌ การตั้งค่าไม่ถูกต้อง กรุณาแก้ไขก่อนดำเนินการต่อ');
    return results;
  }
  
  // ตรวจสอบการเชื่อมต่อ
  results.connection = await checkTelegramConnection();
  console.log('');
  
  if (!results.connection) {
    console.log('❌ การเชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบ Bot Token');
    return results;
  }
  
  // ตรวจสอบ Chat ID
  results.chatId = await checkChatId();
  console.log('');
  
  if (!results.chatId) {
    console.log('❌ Chat ID ไม่ถูกต้อง กรุณาตรวจสอบ Chat ID และให้แน่ใจว่า Bot ได้รับคำสั่ง /start');
    return results;
  }
  
  // ทดสอบการส่งข้อความ
  results.sendMessage = await testSendMessage();
  console.log('');
  
  // สรุปผลการตรวจสอบ
  console.log('📊 สรุปผลการตรวจสอบ:');
  console.log(`   การตั้งค่า: ${results.configuration ? '✅' : '❌'}`);
  console.log(`   การเชื่อมต่อ: ${results.connection ? '✅' : '❌'}`);
  console.log(`   Chat ID: ${results.chatId ? '✅' : '❌'}`);
  console.log(`   การส่งข้อความ: ${results.sendMessage ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n${allPassed ? '🎉 ระบบทำงานถูกต้องทั้งหมด!' : '⚠️ มีปัญหาที่ต้องแก้ไข'}`);
  
  return results;
};

/**
 * แสดงคำแนะนำการแก้ไขปัญหา
 */
export const showTroubleshootingGuide = () => {
  console.log('\n🔧 คำแนะนำการแก้ไขปัญหา:');
  console.log('');
  console.log('1. ตรวจสอบ Bot Token:');
  console.log('   - เปิด Telegram และค้นหา @BotFather');
  console.log('   - ส่งคำสั่ง /mybots');
  console.log('   - เลือก bot ของคุณและดู Token');
  console.log('');
  console.log('2. ตรวจสอบ Chat ID:');
  console.log('   - ส่งข้อความ /start ไปยัง bot ของคุณ');
  console.log('   - เปิด URL: https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates');
  console.log('   - คัดลอก chat.id จาก response');
  console.log('');
  console.log('3. ตรวจสอบ Environment Variables:');
  console.log('   - ตรวจสอบไฟล์ .env');
  console.log('   - ตรวจสอบการตั้งค่าใน Kubernetes ConfigMap');
  console.log('');
  console.log('4. ตรวจสอบ Logs:');
  console.log('   - ดู logs ของ pod ใน Kubernetes');
  console.log('   - ตรวจสอบว่าไม่มี error อื่นๆ');
};

// ใช้งานเมื่อเรียกไฟล์นี้โดยตรง
if (require.main === module) {
  runFullDiagnostic()
    .then((results) => {
      const allPassed = Object.values(results).every(result => result);
      if (!allPassed) {
        showTroubleshootingGuide();
      }
    })
    .catch(console.error);
}
