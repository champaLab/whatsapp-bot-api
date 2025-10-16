import { whatsappClient } from '../../bot/whatsapp/whatsapp';
const { MessageMedia } = require('whatsapp-web.js');

export interface SendMessageRequest {
    to: string;
    message: string;
}

export interface SendMediaRequest {
    to: string;
    media: string; // base64 or URL
    caption?: string;
    filename?: string;
}

export interface WhatsAppStatus {
    connected: boolean;
    qrCode: string | null;
    timestamp: number;
}

export class WhatsAppService {
    /**
     * Send a text message to a WhatsApp number
     */
    public async sendMessage(data: SendMessageRequest): Promise<{ success: boolean; message: string }> {
        try {
            // Validate phone number format
            const phoneNumber = this.formatPhoneNumber(data.to);

            const success = await whatsappClient.sendMessage(phoneNumber, data.message);

            return {
                success,
                message: success ? 'Message sent successfully' : 'Failed to send message'
            };
        } catch (error) {
            console.error('WhatsApp service error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Send media (image, document, etc.) to a WhatsApp number
     */
    public async sendMedia(data: SendMediaRequest): Promise<{ success: boolean; message: string }> {
        try {
            const phoneNumber = this.formatPhoneNumber(data.to);

            // Create MessageMedia from base64 or URL
            let media: any;
            if (data.media.startsWith('data:')) {
                // Base64 data
                const [mimeType, base64Data] = data.media.split(',');
                media = new MessageMedia(mimeType.split(':')[1].split(';')[0], base64Data, data.filename);
            } else if (data.media.startsWith('http')) {
                // URL
                media = await MessageMedia.fromUrl(data.media);
            } else {
                throw new Error('Invalid media format. Must be base64 data URL or HTTP URL');
            }

            const success = await whatsappClient.sendMedia(phoneNumber, media, data.caption);

            return {
                success,
                message: success ? 'Media sent successfully' : 'Failed to send media'
            };
        } catch (error) {
            console.error('WhatsApp media service error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get WhatsApp connection status and QR code
     */
    public getStatus(): WhatsAppStatus {
        const status = whatsappClient.getConnectionStatus();
        return {
            connected: status.connected,
            qrCode: status.qrCode,
            timestamp: Date.now()
        };
    }

    /**
     * Initialize WhatsApp client
     */
    public async initialize(): Promise<{ success: boolean; message: string }> {
        try {
            await whatsappClient.initialize();
            return {
                success: true,
                message: 'WhatsApp client initialized successfully'
            };
        } catch (error) {
            console.error('WhatsApp initialization error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to initialize WhatsApp client'
            };
        }
    }

    /**
     * Format phone number to WhatsApp format
     */
    private formatPhoneNumber(phoneNumber: string): string {
        // Remove all non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');

        // Add country code if not present (assuming +856 for Laos)
        if (cleaned.startsWith('0')) {
            cleaned = '856' + cleaned.substring(1);
        } else if (!cleaned.startsWith('856')) {
            cleaned = '856' + cleaned;
        }

        return cleaned;
    }

    /**
     * Validate phone number format
     */
    public validatePhoneNumber(phoneNumber: string): { valid: boolean; message: string } {
        const cleaned = phoneNumber.replace(/\D/g, '');

        if (cleaned.length < 8 || cleaned.length > 15) {
            return {
                valid: false,
                message: 'Phone number must be between 8 and 15 digits'
            };
        }

        return {
            valid: true,
            message: 'Valid phone number'
        };
    }
}

export const whatsappService = new WhatsAppService();
