import Router from 'express'

import {
    whatsappSendMessageController,
    whatsappSendMediaController,
    whatsappGetStatusController,
    whatsappGetQrController,
    whatsappInitializeController,
    whatsappValidatePhoneController
} from './apis/whatsapp/controller'
import { validateSendMessage, validateSendMedia } from './apis/whatsapp/validate'
import { valResult } from './utils/validateResult'
import { verify } from './utils/jwt'

const router = Router()

// WhatsApp routes
router.post('/whatsapp/send-message', validateSendMessage, valResult, whatsappSendMessageController)
router.post('/whatsapp/send-media', validateSendMedia, valResult, whatsappSendMediaController)
router.get('/whatsapp/status', whatsappGetStatusController)
router.get('/whatsapp/qr', whatsappGetQrController)
router.post('/whatsapp/initialize', whatsappInitializeController)
router.post('/whatsapp/validate-phone', whatsappValidatePhoneController)


export default router
