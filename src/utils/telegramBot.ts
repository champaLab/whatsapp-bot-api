import TelegramBot from 'node-telegram-bot-api'
import logger from '../middleware/logger/config'
import env from '../env'

class TelegramBotService {
    private bot: TelegramBot | null = null
    private token: string

    constructor() {
        this.token = env.TELEGRAM_BOT_TOKEN || ''
        if (this.token) {
            this.initializeBot()
        } else {
            logger.warn('TELEGRAM_BOT_TOKEN not found in environment variables')
        }
    }

    private initializeBot() {
        try {
            this.bot = new TelegramBot(this.token, { polling: false })
            logger.info('Telegram bot initialized successfully')
        } catch (error) {
            logger.error('Failed to initialize Telegram bot:', error)
        }
    }

    /**
     * Send a text message to a specific chat
     * @param chatId - The chat ID to send the message to
     * @param message - The message text to send
     * @param options - Additional options for the message
     * @returns Promise with the sent message or null if failed
     */
    async sendMessage(chatId: string | number | null, message: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message | null> {
        if (!this.bot) {
            logger.error('Telegram bot not initialized')
            return null
        }
        if (!chatId) chatId = env.TELEGRAM_CHAT_ID

        try {
            const result = await this.bot.sendMessage(chatId, message, options)
            logger.info(`Message sent successfully to chat ${chatId}`)
            return result
        } catch (error) {
            logger.error(`Failed to send message to chat ${chatId}:`, error)
            return null
        }
    }

    /**
     * Send a photo to a specific chat
     * @param chatId - The chat ID to send the photo to
     * @param photo - Photo file path, URL, or Buffer
     * @param options - Additional options for the photo
     * @returns Promise with the sent message or null if failed
     */
    async sendPhoto(chatId: string | number, photo: string | Buffer, options?: TelegramBot.SendPhotoOptions): Promise<TelegramBot.Message | null> {
        if (!this.bot) {
            logger.error('Telegram bot not initialized')
            return null
        }

        try {
            // Add contentType to avoid deprecation warning
            const result = await this.bot.sendPhoto(chatId, photo, options, {
                contentType: 'image/png'
            })
            logger.info(`Photo sent successfully to chat ${chatId}`)
            return result
        } catch (error) {
            logger.error(`Failed to send photo to chat ${chatId}:`, error)
            return null
        }
    }

    /**
     * Send a document to a specific chat
     * @param chatId - The chat ID to send the document to
     * @param document - Document file path, URL, or Buffer
     * @param options - Additional options for the document
     * @returns Promise with the sent message or null if failed
     */
    async sendDocument(chatId: string | number, document: string | Buffer, options?: TelegramBot.SendDocumentOptions): Promise<TelegramBot.Message | null> {
        if (!this.bot) {
            logger.error('Telegram bot not initialized')
            return null
        }

        try {
            // Add contentType to avoid deprecation warning
            const result = await this.bot.sendDocument(chatId, document, options, {
                contentType: 'application/octet-stream'
            })
            logger.info(`Document sent successfully to chat ${chatId}`)
            return result
        } catch (error) {
            logger.error(`Failed to send document to chat ${chatId}:`, error)
            return null
        }
    }

    /**
     * Send a formatted message with HTML or Markdown
     * @param chatId - The chat ID to send the message to
     * @param message - The message text to send
     * @param parseMode - The parse mode (HTML or Markdown)
     * @returns Promise with the sent message or null if failed
     */
    async sendFormattedMessage(chatId: string | number, message: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<TelegramBot.Message | null> {
        return this.sendMessage(chatId, message, { parse_mode: parseMode })
    }

    /**
     * Send a notification about POS activities
     * @param chatId - The chat ID to send the notification to
     * @param data - The POS data to include in the notification
     * @returns Promise with the sent message or null if failed
     */
    async sendPOSNotification(chatId: string | number, data: {
        type: 'sale' | 'expense' | 'report'
        amount?: number
        description?: string
        shopName?: string
        timestamp?: string
    }): Promise<TelegramBot.Message | null> {
        const { type, amount, description, shopName, timestamp } = data

        let emoji = '📊'
        let title = 'POS Notification'

        switch (type) {
            case 'sale':
                emoji = '💰'
                title = 'New Sale'
                break
            case 'expense':
                emoji = '💸'
                title = 'New Expense'
                break
            case 'report':
                emoji = '📈'
                title = 'Daily Report'
                break
        }

        const message = `
${emoji} <b>${title}</b>
${shopName ? `🏪 Shop: ${shopName}\n` : ''}${amount ? `💵 Amount: ${amount.toLocaleString()} LAK\n` : ''}${description ? `📝 Description: ${description}\n` : ''}${timestamp ? `⏰ Time: ${timestamp}` : ''}
        `.trim()

        return this.sendFormattedMessage(chatId, message)
    }

    /**
     * Check if the bot is initialized and ready
     * @returns boolean indicating if bot is ready
     */
    isReady(): boolean {
        return this.bot !== null
    }

    /**
     * Get bot information
     * @returns Promise with bot information or null if failed
     */
    async getBotInfo(): Promise<TelegramBot.User | null> {
        if (!this.bot) {
            logger.error('Telegram bot not initialized')
            return null
        }

        try {
            const info = await this.bot.getMe()
            logger.info('Bot info retrieved successfully')
            return info
        } catch (error) {
            logger.error('Failed to get bot info:', error)
            return null
        }
    }
}

// Export a singleton instance
export default new TelegramBotService()
