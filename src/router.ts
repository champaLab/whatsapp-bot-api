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
import { checkApiKey } from './middleware/api-key/api-key'

const router = Router()

// WhatsApp routes
router.post('/whatsapp/send-message', checkApiKey, validateSendMessage, valResult, whatsappSendMessageController)
router.post('/whatsapp/send-media', checkApiKey, validateSendMedia, valResult, whatsappSendMediaController)
router.get('/whatsapp/status', checkApiKey, whatsappGetStatusController)
router.get('/whatsapp/qr', checkApiKey, whatsappGetQrController)
router.post('/whatsapp/initialize', checkApiKey, whatsappInitializeController)
router.post('/whatsapp/validate-phone', checkApiKey, whatsappValidatePhoneController)


export default router
