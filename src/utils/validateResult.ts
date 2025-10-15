import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export const valResult = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.json({
            status: 'error',
            message: errors.array()[0].msg,
            errors: errors.array()
        })
        return
    }
    next()
}
