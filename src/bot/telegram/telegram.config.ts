import TelegramBot from 'node-telegram-bot-api';
import env from '../../env';

export class TelegramService {
    private bot: TelegramBot | null = null;
    private chatId: string | null = null;

    constructor() {
        this.initializeBot();
    }

    private initializeBot() {
        try {
            if (env.TELEGRAM_BOT_TOKEN) {
                this.bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });
                this.chatId = env.TELEGRAM_CHAT_ID; //'6272564307';
                // this.bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, { polling: false });
                // this.chatId = env.TELEGRAM_CHAT_ID;
                console.log('✅ Telegram Bot initialized successfully');
            } else {
                console.warn('⚠️ Telegram Bot Token not found in environment variables');
            }
        } catch (error) {
            console.error('❌ Failed to initialize Telegram Bot:', error);
        }
    }

    /**
     * ส่งข้อความไปยัง Telegram
     */
    async sendMessage(message: string): Promise<boolean> {
        try {
            if (!this.bot || !this.chatId) {
                console.warn('⚠️ Telegram Bot or Chat ID not configured');
                return false;
            }

            // ตรวจสอบว่า chat ID ถูกต้อง
            if (!await this.validateChatId()) {
                console.error('❌ Invalid Chat ID or Bot not started by user');
                return false;
            }

            await this.bot.sendMessage(this.chatId, message);
            console.log('📤 Message sent to Telegram successfully');
            return true;
        } catch (error: any) {
            if (error.code === 'ETELEGRAM' && error.response?.body?.description?.includes('chat not found')) {
                console.error('❌ Chat not found. Please ensure:');
                console.error('   1. The bot has been started by sending /start command');
                console.error('   2. The Chat ID is correct');
                console.error('   3. The user has not blocked the bot');
            } else {
                console.error('❌ Failed to send message to Telegram:', error);
            }
            return false;
        }
    }

    /**
     * ส่งรูปภาพไปยัง Telegram
     */
    async sendPhoto(imagePath: string, caption?: string): Promise<boolean> {
        try {
            if (!this.bot || !this.chatId) {
                console.warn('⚠️ Telegram Bot or Chat ID not configured');
                return false;
            }

            // ตรวจสอบว่า chat ID ถูกต้อง
            if (!await this.validateChatId()) {
                console.error('❌ Invalid Chat ID or Bot not started by user');
                return false;
            }

            // Use the new file sending approach to avoid deprecation warning
            await this.bot.sendPhoto(this.chatId, imagePath, {
                caption: caption || 'QR Code for WhatsApp Authentication'
            }, {
                contentType: 'image/png'
            });
            console.log('📤 Photo sent to Telegram successfully');
            return true;
        } catch (error: any) {
            if (error.code === 'ETELEGRAM' && error.response?.body?.description?.includes('chat not found')) {
                console.error('❌ Chat not found. Please ensure:');
                console.error('   1. The bot has been started by sending /start command');
                console.error('   2. The Chat ID is correct');
                console.error('   3. The user has not blocked the bot');
            } else {
                console.error('❌ Failed to send photo to Telegram:', error);
            }
            return false;
        }
    }

    /**
     * ส่งไฟล์ไปยัง Telegram
     */
    async sendDocument(filePath: string, caption?: string): Promise<boolean> {
        try {
            if (!this.bot || !this.chatId) {
                console.warn('⚠️ Telegram Bot or Chat ID not configured');
                return false;
            }

            // ตรวจสอบว่า chat ID ถูกต้อง
            if (!await this.validateChatId()) {
                console.error('❌ Invalid Chat ID or Bot not started by user');
                return false;
            }

            // Use the new file sending approach to avoid deprecation warning
            await this.bot.sendDocument(this.chatId, filePath, {
                caption: caption || 'QR Code for WhatsApp Authentication'
            }, {
                contentType: 'application/octet-stream'
            });
            console.log('📤 Document sent to Telegram successfully');
            return true;
        } catch (error: any) {
            if (error.code === 'ETELEGRAM' && error.response?.body?.description?.includes('chat not found')) {
                console.error('❌ Chat not found. Please ensure:');
                console.error('   1. The bot has been started by sending /start command');
                console.error('   2. The Chat ID is correct');
                console.error('   3. The user has not blocked the bot');
            } else {
                console.error('❌ Failed to send document to Telegram:', error);
            }
            return false;
        }
    }

    /**
     * ตรวจสอบสถานะของ Bot
     */
    isReady(): boolean {
        return this.bot !== null && this.chatId !== null;
    }

    /**
     * ตรวจสอบว่า Chat ID ถูกต้องและ Bot สามารถส่งข้อความได้
     */
    private async validateChatId(): Promise<boolean> {
        try {
            if (!this.bot || !this.chatId) {
                return false;
            }

            // ใช้ getChat เพื่อตรวจสอบว่า chat ID ถูกต้อง
            await this.bot.getChat(this.chatId);
            return true;
        } catch (error: any) {
            if (error.code === 'ETELEGRAM') {
                console.error('❌ Chat validation failed:', error.response?.body?.description || error.message);
                return false;
            }
            console.error('❌ Error validating chat ID:', error);
            return false;
        }
    }

    /**
     * ตั้งค่า Chat ID
     */
    setChatId(chatId: string): void {
        this.chatId = chatId;
        console.log(`📝 Chat ID set to: ${chatId}`);
    }

    /**
     * รับ Chat ID ปัจจุบัน
     */
    getChatId(): string | null {
        return this.chatId;
    }

    /**
     * ตรวจสอบสถานะการเชื่อมต่อ
     */
    async checkConnection(): Promise<boolean> {
        try {
            if (!this.bot) {
                return false;
            }

            // ใช้ getMe เพื่อตรวจสอบว่า bot token ถูกต้อง
            await this.bot.getMe();
            return true;
        } catch (error) {
            console.error('❌ Telegram Bot connection failed:', error);
            return false;
        }
    }
}

// สร้าง instance เดียวสำหรับใช้ทั่วทั้งแอป
export const telegramService = new TelegramService();
