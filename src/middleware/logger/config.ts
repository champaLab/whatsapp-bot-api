import fs from 'fs-extra'
import { join } from 'path'
import winston from 'winston'
import 'winston-daily-rotate-file'
import env from '../../env'
import { logNamespace } from './logger-middleware'

const logDirectory = join(env.PWD, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const transport = new winston.transports.DailyRotateFile({
    filename: join(logDirectory, '%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '10m', // Maximum file size before rotation
    maxFiles: undefined // Keep logs for 1 days
})

const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify(
            {
                timestamp,
                level: `${level}`.toUpperCase(),
                message,
                requestId: logNamespace?.get('requestId'),
                tracingData: logNamespace?.get('tracingData'),
                username: logNamespace?.get('username'),
                user_type_name: logNamespace?.get('user_type_name'),
                ...meta
            },
            null,
            env.NODE_ENV === 'production' ? 0 : 4
        )
    })
)

const logger = winston.createLogger({
    level: 'verbose',
    format: customFormat,
    transports: [
        new winston.transports.Console({
            format: winston.format.colorize({ all: env.NODE_ENV === 'development' })
        }),
        transport
    ],
    defaultMeta: {
        service: env.SERVICE_NAME,
        node_port: env.NODE_PORT,
        base_path: env.BASE_PATH,
        environment: env.NODE_ENV
    }
})

export default logger
