import app from './app'
import env from './env'
import logger from './middleware/logger/config'
import { logNamespace } from './middleware/logger/logger-middleware'
import { initializeWhatsApp, whatsappClient } from './bot/whatsapp/whatsapp'

logNamespace.run(() => { })



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
