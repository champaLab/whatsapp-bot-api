import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import prom from 'prom-client'
import router from './router'
import env from './env'
import { join } from 'path'
import { limiter } from './utils/limiter'
import requestIp from 'request-ip'
import { logRequestResponse } from './middleware/logger/logger-middleware'

const app = express()

const register = new prom.Registry()
register.setDefaultLabels({
    worker: env.SERVICE_NAME
})
const collectDefaultMetrics = prom.collectDefaultMetrics
collectDefaultMetrics({
    labels: { NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE },
    register
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', true)
app.set('trust proxy', 'loopback')
app.use(limiter)
app.use(requestIp.mw())

app.use((req: Request, res: Response, next: NextFunction) => logRequestResponse(req, res, next, ['excel', 'users', 'metrics']))

app.use(`${env.BASE_PATH}/v1`, router)
app.use(`${env.BASE_PATH}`, express.static(join(env.PWD, 'uploads')))

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType)
    res.send(await register.metrics())
})

app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        upTime: process.uptime(),
        base_path: env.BASE_PATH,
        port: env.NODE_PORT,
        timestamp: Date.now(),
        instance: process.env.NODE_APP_INSTANCE
    })
})

app.get(env.BASE_PATH, (req, res) => {
    res.json({
        status: 'OK',
        upTime: process.uptime(),
        timestamp: Date.now(),
        instance: process.env.NODE_APP_INSTANCE
    })
})

export default app
