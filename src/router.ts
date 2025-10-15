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
router.post('/whatsapp/send-media', verify, validateSendMedia, valResult, whatsappSendMediaController)
router.get('/whatsapp/status', verify, whatsappGetStatusController)
router.get('/whatsapp/qr', verify, whatsappGetQrController)
router.post('/whatsapp/initialize', verify, whatsappInitializeController)
router.post('/whatsapp/validate-phone', verify, whatsappValidatePhoneController)


export default router
