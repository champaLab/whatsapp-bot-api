import { Request } from 'express'
import env from '../env'
import { existsSync } from 'fs-extra'

export const getPhotoPath = (file: Express.Multer.File | undefined) => {
    try {
        let path: string | undefined = file?.path

        if (!path || (path && path.length <= 5)) return null
        path = path.split('uploads').pop()

        return path ?? null
    } catch (error) {
        return null
    }
}

export const checkFileExist = ({ logo, isFullPath }: { logo: string | null, isFullPath: boolean }) => {
    try {
        const path = env.PWD + '/uploads' + logo
        const logoExists = logo && existsSync(path)
        if (logoExists) return isFullPath ? env.HOST_IMAGE + logo : path
        return null
    } catch (error) {
        return null
    }
}
