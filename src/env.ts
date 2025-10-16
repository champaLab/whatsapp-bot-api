import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// Set environment variable to suppress Telegram bot deprecation warning
if (process.env.NTBA_FIX_350 !== 'false') {
    process.env.NTBA_FIX_350 = 'true';
}

export default {
    SERVICE_NAME: process.env.SERVICE_NAME,
    NODE_ENV: process.env.NODE_ENV,
    NODE_HOST: process.env.NODE_HOST || '0.0.0.0',
    NODE_PORT: parseInt(`${process.env.NODE_PORT}`) || 1199,
    TZ: process.env.TZ || 'Aisa/Bangkok',
    PWD: process.env.PWD || process.cwd(),
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY ?? '',
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY ?? '',
    JWT_REFRESH_PRIVATE_KEY: process.env.JWT_REFRESH_PRIVATE_KEY ?? '',
    JWT_REFRESH_PUBLIC_KEY: process.env.JWT_REFRESH_PUBLIC_KEY ?? '',

    PRISMA_DB_CONN: process.env.PRISMA_DB_CONN,
    BASE_PATH: `${process.env.BASE_PATH}`,
    HOST_IMAGE: process.env.HOST_IMAGE || 'http://127.0.0.1:1199',
    DISCORD_WEBHOOK_IMAGE: `${process.env.DISCORD_WEBHOOK_IMAGE}`,
    DISCORD_MONITORING_CHANNEL_HOOK: `${process.env.DISCORD_MONITORING_CHANNEL_HOOK}`,
    DISCORD_WEBHOOK_TEXT: `${process.env.DISCORD_WEBHOOK_TEXT}`,
    API_BOT_URL: `${process.env.API_BOT_URL}`,
    QR_ENCRYPTION_KEY: `${process.env.QR_ENCRYPTION_KEY}`,
    CONTACT_NUMBER: `${process.env.CONTACT_NUMBER}`,
    ROW_PER_PAGE: Number(`${process.env.ROW_PER_PAGE ?? 25}`),
    TELEGRAM_BOT_TOKEN: `${process.env.TELEGRAM_BOT_TOKEN}`,
    TELEGRAM_CHAT_ID: `${process.env.TELEGRAM_CHAT_ID}`,
    NTBA_FIX_350: process.env.NTBA_FIX_350 === 'true'

}
