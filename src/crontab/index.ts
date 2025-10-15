import crontab from 'node-cron'

crontab.schedule('0 */1 * * *', async () => {})
