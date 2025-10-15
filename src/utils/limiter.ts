import { Request, Response } from 'express'
import rateLimit, { ipKeyGenerator } from 'express-rate-limit'

const rateLimitExceededHandler = (req: Request, res: Response) => {
    res.status(429).json({
        status: 'error',
        message: 'Too many requests, please try again later.'
    })
}

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes window
    max: 500, // Limit each IP to 20 requests per windowMs
    standardHeaders: 'draft-7', // Use the combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: rateLimitExceededHandler, // Custom handler for rate limit exceeded
    keyGenerator: (req: Request) => {
        // Use the forwarded IP if available, otherwise fall back to the direct IP
        const forwarded = req.get('X-Forwarded-For')
        const realIp = req.get('X-Real-IP')
        const forwardedHeader = req.get('Forwarded')

        // Parse the Forwarded header if present
        if (forwardedHeader) {
            const forwardedMatch = forwardedHeader.match(/for=([^;,\s]+)/i)
            if (forwardedMatch) {
                return forwardedMatch[1].replace(/"/g, '')
            }
        }

        // Fall back to X-Forwarded-For (first IP in the chain)
        if (forwarded) {
            return forwarded.split(',')[0].trim()
        }

        // Fall back to X-Real-IP
        if (realIp) {
            return realIp
        }

        // Use ipKeyGenerator for proper IPv6 handling when falling back to direct IP
        const ip = req.ip || req.connection.remoteAddress || 'unknown'
        return ipKeyGenerator(ip)
    },
    skip: (req, res) => {
        // Skip rate limiting for certain requests, e.g., internal API calls
        return req.ip === '127.0.0.1' // Example: skip local requests
    }
})
