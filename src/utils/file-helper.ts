import multer, { diskStorage } from 'multer'
import dayjs from 'dayjs'
import { resolve } from 'path'
import env from '../env'
import fs from 'fs-extra'
import { setFileName } from './functions'
const date_dir = dayjs().format('YYYYMMDD')

export const upload = (directory: string = '', separateByDate = false) =>
    multer({
        storage: diskStorage({
            destination: resolve(`${env.PWD}/uploads/${directory}`),
            filename: (_, file, cb) => {
                console.log('file upload', file)
                const ext = file.originalname.split('.').pop()
                console.log({ ext })
                // const ext = file.mimetype.split('/').pop()
                const fileName = date_dir + file.fieldname + setFileName() + `.${ext}`
                // const fileName = date_dir + file.fieldname + setFileName() + `.png`
                cb(null, `${fileName}`)
            }
        })
    })
