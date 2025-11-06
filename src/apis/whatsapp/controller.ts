import { Request, Response } from 'express';
import { whatsappService } from './service';
import { telegramService } from '../../bot/telegram';

/**
 * Send a text message via WhatsApp
 * POST /whatsapp/send-message
 */
export const whatsappSendMessageController = async (req: Request, res: Response) => {
    try {
        const { to, message } = req.body;

        const result = await whatsappService.sendMessage({ to, message });

        if (result.success) {
            return res.json({ status: 'success', message: 'Message sent successfully', data: result });
        } else {
            const message = `❌❌ WhatsApp session error ❌❌`;
            await telegramService.sendMessage(message);
            return res.status(400).json({ status: 'error', message: result.message, data: null });
        }
    } catch (error) {
        console.error('Send message controller error:', error);
        const message = `❌❌ WhatsApp session error ❌❌`;
        await telegramService.sendMessage(message);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

/**
 * Send media (image, document, etc.) via WhatsApp
 * POST /whatsapp/send-media
 */
export const whatsappSendMediaController = async (req: Request, res: Response) => {
    try {
        const { to, media, caption, filename } = req.body;

        const result = await whatsappService.sendMedia({ to, media, caption, filename });

        if (result.success) {
            return res.json({ status: 'success', message: 'Media sent successfully', data: result });
        } else {
            return res.status(400).json({ status: 'error', message: result.message, data: null });
        }
    } catch (error) {
        console.error('Send media controller error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

/**
 * Get WhatsApp connection status and QR code
 * GET /whatsapp/status
 */
export const whatsappGetStatusController = async (req: Request, res: Response) => {
    try {
        const status = whatsappService.getStatus();

        return res.json({ status: 'success', message: 'Status retrieved successfully', data: status });
    } catch (error) {
        console.error('Get status controller error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

/**
 * Get QR code for WhatsApp authentication
 * GET /whatsapp/qr
 */
export const whatsappGetQrController = async (req: Request, res: Response) => {
    try {
        const status = whatsappService.getStatus();

        if (status.qrCode) {
            return res.json({
                status: 'success', message: 'QR code retrieved successfully', data: {
                    qrCode: status.qrCode,
                    connected: status.connected,
                    timestamp: status.timestamp
                }
            });
        } else if (status.connected) {
            return res.json({
                status: 'success', message: 'WhatsApp is already connected', data: {
                    qrCode: null,
                    connected: true,
                    timestamp: status.timestamp
                }
            });
        } else {
            return res.status(404).json({
                status: 'error', message: 'QR code not available. Please try again later.', data: {
                    qrCode: null,
                    connected: false,
                    timestamp: status.timestamp
                }
            });
        }
    } catch (error) {
        console.error('Get QR controller error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

/**
 * Initialize WhatsApp client
 * POST /whatsapp/initialize
 */
export const whatsappInitializeController = async (req: Request, res: Response) => {
    try {
        const result = await whatsappService.initialize();

        if (result.success) {
            return res.json({ status: 'success', message: result.message, data: result });
        } else {
            return res.status(400).json({ status: 'error', message: result.message, data: null });
        }
    } catch (error) {
        console.error('Initialize controller error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};

/**
 * Validate phone number
 * POST /whatsapp/validate-phone
 */
export const whatsappValidatePhoneController = async (req: Request, res: Response) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ status: 'error', message: 'Phone number is required', data: null });
        }

        const validation = whatsappService.validatePhoneNumber(phoneNumber);

        return res.json({
            status: 'success', message: validation.message, data: {
                valid: validation.valid,
                phoneNumber: phoneNumber
            }
        });
    } catch (error) {
        console.error('Validate phone controller error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', data: null });
    }
};
