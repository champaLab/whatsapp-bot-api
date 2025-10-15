import { PrismaClient } from '@prisma/client'
import extension from '../utils/extension'
extension // do not delete extension

const prismaClient = new PrismaClient({
    // log: ["query"]
})

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await prismaClient.$disconnect()
})

process.on('SIGINT', async () => {
    await prismaClient.$disconnect()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    await prismaClient.$disconnect()
    process.exit(0)
})

export default prismaClient

