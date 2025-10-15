export interface SendMessageRequest {
    to: string;
    message: string;
}

export interface SendMediaRequest {
    to: string;
    media: string; // base64 or URL
    caption?: string;
    filename?: string;
}

export interface WhatsAppStatus {
    connected: boolean;
    qrCode: string | null;
    timestamp: number;
}

export interface WhatsAppResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface PhoneValidation {
    valid: boolean;
    message: string;
    phoneNumber: string;
}
