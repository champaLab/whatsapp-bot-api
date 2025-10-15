import { body } from 'express-validator';

export const validateSendMessage = [
    body('to')
        .notEmpty()
        .withMessage('Phone number is required')
        .isString()
        .withMessage('Phone number must be a string')
        .custom((value) => {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length < 8 || cleaned.length > 15) {
                throw new Error('Phone number must be between 8 and 15 digits');
            }
            return true;
        }),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isString()
        .withMessage('Message must be a string')
        .isLength({ min: 1, max: 4096 })
        .withMessage('Message must be between 1 and 4096 characters')
];

export const validateSendMedia = [
    body('to')
        .notEmpty()
        .withMessage('Phone number is required')
        .isString()
        .withMessage('Phone number must be a string')
        .custom((value) => {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length < 8 || cleaned.length > 15) {
                throw new Error('Phone number must be between 8 and 15 digits');
            }
            return true;
        }),
    body('media')
        .notEmpty()
        .withMessage('Media is required')
        .isString()
        .withMessage('Media must be a string')
        .custom((value) => {
            // Check if it's a valid base64 data URL or HTTP URL
            const isBase64DataUrl = value.startsWith('data:');
            const isHttpUrl = value.startsWith('http://') || value.startsWith('https://');

            if (!isBase64DataUrl && !isHttpUrl) {
                throw new Error('Media must be a base64 data URL or HTTP URL');
            }
            return true;
        }),
    body('caption')
        .optional()
        .isString()
        .withMessage('Caption must be a string')
        .isLength({ max: 1024 })
        .withMessage('Caption must be less than 1024 characters'),
    body('filename')
        .optional()
        .isString()
        .withMessage('Filename must be a string')
        .isLength({ max: 255 })
        .withMessage('Filename must be less than 255 characters')
];
