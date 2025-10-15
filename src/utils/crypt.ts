import env from '../env'
import crypto, { createHash } from 'crypto'
const ENCRYPTION_KEY = env.ENCRYPTION_KEY || '7nB3rrON3PrDR4y4s6liBNC4M4P562kg' // Must be 256 bits (32 characters)
const QR_ENCRYPTION_KEY = env.QR_ENCRYPTION_KEY // Must be 256 bits (32 characters)

const IV_LENGTH = 16 // For AES, this is always 16

export function encrypt(text: string) {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string) {
    let textParts = text.split(':')
    let iv = Buffer.from(textParts.shift()!, 'hex')
    let encryptedText = Buffer.from(textParts.join(':'), 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

export async function hashedString(text: string) {
    const md5Hash = createHash('sha512')
    md5Hash.update(text)
    const hashedText = md5Hash.digest('hex')
    return hashedText
}

export function encryptQrParking(text: string) {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(QR_ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decryptQrParking(text: string) {
    try {
        let textParts = text.split(':')
        let iv = Buffer.from(textParts.shift()!, 'hex')
        let encryptedText = Buffer.from(textParts.join(':'), 'hex')
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(QR_ENCRYPTION_KEY), iv)
        let decrypted = decipher.update(encryptedText)

        decrypted = Buffer.concat([decrypted, decipher.final()])
        return decrypted.toString()
    } catch (error) {
        return null
    }
}
