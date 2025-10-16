const { Client, LocalAuth, } = require('whatsapp-web.js');
import { join } from 'path';
import { existsSync, mkdirSync, } from 'fs';
import puppeteer from 'puppeteer';
import qrCode from "qrcode-terminal";
import logger from '../../middleware/logger/config';
import { qrCodeGenerator, telegramService } from '../telegram';
import dayjs from 'dayjs';
import env from '../../env';


const getChatId = async (msg: any) => {
    const message = ["id", "chat id", "chatid"];

    if (message.includes(`${msg.body}`.trim().toLowerCase())) {
        const chat = await msg.getChat();

        if (chat.isGroup) {
            const groupChat = chat as any;

            const chatId = `${chat.id._serialized}`.split("@")[0];
            console.log({ chatId });
            await msg.reply(`🆔 Group ID `);
            await msg.reply(`${chatId}`);
        }
    }
};


// Type declarations for whatsapp-web.js
declare global {
    interface EventSendOptions {
        [key: string]: any;
    }
}

export interface WhatsAppConfig {
    sessionPath: string;
    puppeteerOptions: any;
}

export class WhatsAppClient {
    private client: any;
    private isConnected: boolean = false;
    private qrCode: string | null = null;
    private sessionPath: string;

    constructor(config: WhatsAppConfig) {
        this.sessionPath = config.sessionPath;

        // Ensure session directory exists
        if (!existsSync(this.sessionPath)) {
            mkdirSync(this.sessionPath, { recursive: true });
        }

        this.client = new Client({
            authStrategy: new LocalAuth({
                clientId: 'whatsapp-client',
                dataPath: this.sessionPath
            }),
            puppeteer: {
                headless: true,
                executablePath: puppeteer.executablePath(),
                timeout: 60000,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-extensions',
                    '--disable-plugins',
                    '--disable-default-apps',
                    '--disable-sync',
                    '--disable-translate',
                    '--hide-scrollbars',
                    '--mute-audio',
                    '--no-default-browser-check',
                    '--no-pings',
                    '--password-store=basic',
                    '--use-mock-keychain',
                    '--disable-background-networking',
                    '--disable-client-side-phishing-detection',
                    '--disable-component-extensions-with-background-pages',
                    '--disable-hang-monitor',
                    '--disable-ipc-flooding-protection',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--force-color-profile=srgb',
                    '--metrics-recording-only',
                    '--enable-automation',
                    '--disable-blink-features=AutomationControlled',
                    '--remote-debugging-port=0',
                    '--disable-background-networking',
                    '--disable-default-apps',
                    '--disable-sync',
                    '--disable-translate',
                    '--hide-scrollbars',
                    '--mute-audio',
                    '--no-first-run',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-client-side-phishing-detection',
                    '--disable-component-extensions-with-background-pages',
                    '--disable-hang-monitor',
                    '--disable-ipc-flooding-protection',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--force-color-profile=srgb',
                    '--metrics-recording-only',
                    '--enable-automation',
                    '--password-store=basic',
                    '--use-mock-keychain',
                    '--disable-blink-features=AutomationControlled',
                    '--remote-debugging-port=0',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection',
                    '--disable-renderer-backgrounding',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-background-timer-throttling',
                    '--disable-background-networking',
                    '--disable-default-apps',
                    '--disable-sync',
                    '--disable-translate',
                    '--hide-scrollbars',
                    '--mute-audio',
                    '--no-first-run',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-client-side-phishing-detection',
                    '--disable-component-extensions-with-background-pages',
                    '--disable-hang-monitor',
                    '--disable-ipc-flooding-protection',
                    '--disable-popup-blocking',
                    '--disable-prompt-on-repost',
                    '--force-color-profile=srgb',
                    '--metrics-recording-only',
                    '--enable-automation',
                    '--password-store=basic',
                    '--use-mock-keychain',
                    '--disable-blink-features=AutomationControlled',
                    '--remote-debugging-port=0'
                ]
            }
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.client.on('qr', async (qr: string) => {
            console.log('🔗 WhatsApp QR Code generated');
            // remove
            // this.qrCode = await qrcode.toDataURL(qr);
            // generate a qr code image 
            // DELETE folder whatsapp-sessions
            // if (existsSync(this.sessionPath)) {
            //     rmdirSync(this.sessionPath, { recursive: true });
            // }

            qrCode.generate(qr, { small: true });

            try {
                // สร้าง QR Code เป็นรูปภาพ
                const qrImagePath = await qrCodeGenerator.generateQRImage(qr);

                if (qrImagePath) {

                    const time = dayjs().add(2, 'minutes').format('YYYY-MM-DD HH:mm:ss')
                    // ส่งรูปภาพ QR Code ไปยัง Telegram
                    const mode = env.NODE_ENV
                    await telegramService.sendPhoto(qrImagePath, 'Environment: ' + mode + '\n\nLogin Before: ' + time);
                } else {
                    console.error('❌ Failed to generate QR image');
                }
            } catch (error) {
                console.error('❌ Error sending QR code to Telegram:', error);
            }

            console.log('📱 Scan the QR code with your WhatsApp mobile app');
        });

        this.client.on('ready', () => {
            console.log('✅ WhatsApp client is ready!');
            this.isConnected = true;
            this.qrCode = null;
        });

        this.client.on('authenticated', () => {
            console.log('🔐 WhatsApp client authenticated successfully');
        });

        this.client.on('auth_failure', (msg: string) => {
            console.error('❌ WhatsApp authentication failed:', msg);
            this.isConnected = false;
        });

        this.client.on('disconnected', (reason: string) => {
            console.log('🔌 WhatsApp client disconnected:', reason);
            this.isConnected = false;
            this.qrCode = null;
        });

        this.client.on('message', getChatId);
    }

    public async initialize(): Promise<void> {
        try {
            console.log('🚀 Initializing WhatsApp client...');

            // Clean up any existing session locks
            await this.cleanupBrowserProcesses();

            // Add a delay to prevent rapid initialization attempts
            await new Promise(resolve => setTimeout(resolve, 1000));

            await this.client.initialize();
        } catch (error) {
            console.error('❌ Failed to initialize WhatsApp client:', error);

            // Handle different types of errors
            if (error instanceof Error) {
                if (error.message.includes('SingletonLock') || error.message.includes('Failed to launch')) {
                    console.log('🔄 Detected browser lock, cleaning up and retrying...');
                    try {
                        await this.cleanupBrowserProcesses();
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        await this.client.initialize();
                        console.log('✅ WhatsApp client initialized successfully on retry');
                        return;
                    } catch (retryError) {
                        console.error('❌ Retry failed:', retryError);
                    }
                } else if (error.message.includes('Target closed') || error.message.includes('Protocol error')) {
                    console.log('🔄 Detected browser crash, cleaning up and retrying...');
                    try {
                        // Clean up more aggressively for crashed browsers
                        await this.cleanupBrowserProcesses();
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        await this.client.initialize();
                        console.log('✅ WhatsApp client initialized successfully after browser crash recovery');
                        return;
                    } catch (retryError) {
                        console.error('❌ Browser crash recovery failed:', retryError);
                    }
                }
            }

            throw error;
        }
    }

    private async cleanupBrowserProcesses(): Promise<void> {
        try {
            const { execSync } = require('child_process');

            // Only clean up session locks, don't kill all Chrome processes
            try {
                execSync(`rm -rf ${this.sessionPath}/session-whatsapp-client/SingletonLock*`, { stdio: 'ignore' });
                execSync(`rm -rf ${this.sessionPath}/session-whatsapp-client/Singleton*`, { stdio: 'ignore' });
                execSync(`rm -rf ${this.sessionPath}/session-whatsapp-client/chrome_debug.log`, { stdio: 'ignore' });
                execSync(`rm -rf ${this.sessionPath}/session-whatsapp-client/chrome_shutdown_ms.txt`, { stdio: 'ignore' });
                execSync(`rm -rf ${this.sessionPath}/session-whatsapp-client/First Run`, { stdio: 'ignore' });
            } catch (e) {
                // Ignore errors if files don't exist
            }

            // Wait a moment for any locks to be released
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.log('⚠️  Warning: Could not clean up session locks:', error);
        }
    }

    public async sendMessage(to: string, message: string): Promise<boolean> {
        try {
            if (!this.isConnected) {
                throw new Error('WhatsApp client is not connected');
            }

            const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
            await this.client.sendMessage(chatId, message);
            console.log(`📤 Message sent to ${to}: ${message}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send message:', error);
            throw error;
        }
    }

    public async sendMedia(to: string, media: any, caption?: string): Promise<boolean> {
        try {
            if (!this.isConnected) {
                throw new Error('WhatsApp client is not connected');
            }

            const chatId = to.includes('@c.us') ? to : `${to}@c.us`;
            await this.client.sendMessage(chatId, media, { caption });
            console.log(`📤 Media sent to ${to}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send media:', error);
            throw error;
        }
    }

    public getConnectionStatus(): { connected: boolean; qrCode: string | null } {
        return {
            connected: this.isConnected,
            qrCode: this.qrCode
        };
    }

    public async destroy(): Promise<void> {
        try {
            await this.client.destroy();
            console.log('🔌 WhatsApp client destroyed');

            // Clean up browser processes after destruction
            await this.cleanupBrowserProcesses();
        } catch (error) {
            console.error('❌ Error destroying WhatsApp client:', error);
        }
    }

    public getClient(): any {
        return this.client;
    }
}

// Create singleton instance
const whatsappConfig: WhatsAppConfig = {
    sessionPath: join(process.cwd(), 'whatsapp-sessions'),
    puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
};

export const whatsappClient = new WhatsAppClient(whatsappConfig);



// Initialize WhatsApp client
export const initializeWhatsApp = async () => {
    try {
        console.log('🚀 Initializing WhatsApp client...')
        await whatsappClient.initialize()
        console.log('✅ WhatsApp client initialized successfully')
    } catch (error) {
        console.error('❌ Failed to initialize WhatsApp client:', error)
        logger.error('WhatsApp initialization failed', error)

        // Don't exit the process, just log the error and continue
        console.log('⚠️  WhatsApp functionality will not be available until the issue is resolved')
    }
}
