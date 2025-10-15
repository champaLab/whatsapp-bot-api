import dayjs from 'dayjs'
import os from 'os'
import { join } from 'path'
import winston from 'winston'
import 'winston-daily-rotate-file'
import env from '../../env'

export function logToCustomPath(logData: { data: string; logName: string; path?: string | null }) {
    const filePath = logData.path ? logData.path : join(env.PWD, 'logs')

    const transport = new winston.transports.DailyRotateFile({
        filename: join(filePath, `${logData.logName}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m', // Customize the max size as needed
        maxFiles: undefined // Customize the retention period as needed
    })

    const logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.printf(({ timestamp, message }) => {
                return `${timestamp}: ${message}`
            })
        ),
        transports: [transport]
    })

    logger.info(logData.data)
}
