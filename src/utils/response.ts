import { Request, Response } from 'express'
import env from '../env'
import logger from '../middleware/logger/config'
import telegramBot from './telegramBot'

export const handleErrorResponse = async ({
    req,
    res,
    message,
    error,
    statusCode,
    data
}: {
    req: Request
    res: Response
    message?: string
    error: any
    statusCode?: number
    data?: any
}) => {
    if (env.NODE_ENV === 'production') {
        logger.error(error)
    } else {
        console.error(error)
    }

    try {
        const chatId = env.TELEGRAM_CHAT_ID
        const messageText = (message ?? 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່') + '\n\nPATH:' + JSON.stringify(req.body) + '\n\nPATH:' + req.originalUrl + '\n\nIP:' + req.ip

        await telegramBot.sendMessage(chatId, messageText)

    } catch (error) {
        logger.error('Error in handleErrorResponse:', error)
    }

    const response = data
        ? {
            status: 'error',
            message: message ?? 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່',
            error: error,
            data: data
        }
        : {
            status: 'error',
            message: message ?? 'ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່',
            error: error,
            data: []
        }
    res.status(statusCode || 400).json(response)
}
