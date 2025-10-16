import { NextFunction, Request, Response } from 'express'
import { checkApiKeyService } from './service'
import dayjs from 'dayjs'

export const checkApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string
    // console.log({ apiKey })

    if (!apiKey) {
        res.status(401).json({ status: 'error', message: 'Missing API key' })
    } else {
        const checkApiKey = await checkApiKeyService(apiKey)

        if (!checkApiKey) {
            res.status(401).json({ status: 'error', message: 'API key invalid' })
        } else if (dayjs(checkApiKey.expiredAt).isBefore(dayjs())) {
            res.status(401).json({ status: 'error', message: 'API key expired, please request a new API key' })
        } else if (!checkApiKey.status) {
            res.status(401).json({ status: 'error', message: 'Your API key has been disabled' })
        } else {
            next()
        }
    }
}
