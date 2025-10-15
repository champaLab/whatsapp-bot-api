import { NextFunction, Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import env from '../env'

const i = 'Champa Lab' // Issuer (Software organization who issues the token)
const s = 'sonephetmnlv@gmail.com' // Subject (intended user of the token)
const a = 'https://champalab.com' // Audience (Domain within which this token will live and function)


export const sign = async (payload: object) => {
    const privateKEY = env.JWT_PRIVATE_KEY ?? ''

    return jwt.sign(payload, privateKEY, {
        issuer: i,
        subject: s,
        audience: a,
        expiresIn: '1d',
        algorithm: 'PS512'
    })
}

export const verify = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['x-access-token'] as string

    if (req.headers.authorization) {
        token = `${req.headers.authorization}`.replace('Bearer ', '')
    }
    if (!token) {
        res.json({ status: 'invalid', message: 'No token provided.' })
        return
    }

    const publicKEY = env.JWT_PUBLIC_KEY ?? ''

    jwt.verify(token, publicKEY, {
        issuer: i,
        subject: s,
        audience: a,
        maxAge: '1d',
        algorithms: ['PS512']
    }, (err, decoded) => {
        if (err) {
            res.json({ status: 'invalid', message: 'Token unauthorized.' })
            return
        }
        if (decoded) {
            // @ts-ignore
            req.tokenPayload = decoded as TokenPayload

            console.log(decoded)
        }
        next()
    })
}
