import app from './app'
import env from './env'
import logger from './middleware/logger/config'
import { logNamespace } from './middleware/logger/logger-middleware'
import { whatsappClient } from './config/whatsapp'

logNamespace.run(() => { })

// Initialize WhatsApp client
const initializeWhatsApp = async () => {
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

const server = app.listen(env.NODE_PORT, env.NODE_HOST, async () => {
    console.log(`Listening on ${env.NODE_HOST}:${env.NODE_PORT}${env.BASE_PATH}`)
    logger.info('Started', `Listening on ${env.NODE_HOST}:${env.NODE_PORT} ${env.BASE_PATH}`)

    // Initialize WhatsApp after server starts
    await initializeWhatsApp()
})

for (const signal of ['SIGINT', 'SIGBREAK', 'SIGTERM']) {
    process.on(signal, async () => {
        logger.info(`${signal} signal received.`)
        logger.info('Closing http server.')

        // Cleanup WhatsApp client
        try {
            await whatsappClient.destroy()
            logger.info('WhatsApp client destroyed.')
        } catch (error) {
            logger.error('Error destroying WhatsApp client:', error)
        }

        server.close(() => {
            logger.info('Http server closed.')
            process.exit(0)
        })
    })
}
