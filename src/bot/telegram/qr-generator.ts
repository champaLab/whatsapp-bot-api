import QRCode from 'qrcode';
import { join } from 'path';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

export class QRCodeGenerator {
    private qrFolder: string;

    constructor() {
        this.qrFolder = join(process.cwd(), '/uploads/qr-codes');
        this.ensureQRFolder();
    }

    /**
     * สร้างโฟลเดอร์ qr-codes ถ้ายังไม่มี
     */
    private async ensureQRFolder(): Promise<void> {
        try {
            if (!fs.existsSync(this.qrFolder)) {
                await mkdir(this.qrFolder, { recursive: true });
                console.log('📁 Created QR codes folder');
            }
        } catch (error) {
            console.error('❌ Failed to create QR codes folder:', error);
        }
    }

    /**
     * สร้าง QR Code เป็นรูปภาพ PNG
     */
    async generateQRImage(qrString: string): Promise<string | null> {
        try {
            await this.ensureQRFolder();

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `whatsapp-qr.png`;
            const filePath = join(this.qrFolder, fileName);

            // ตั้งค่าสำหรับ QR Code
            const qrOptions = {
                type: 'png' as const,
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 512,
                errorCorrectionLevel: 'M' as const
            };

            // สร้าง QR Code เป็น Buffer
            const qrBuffer = await QRCode.toBuffer(qrString, qrOptions);

            // บันทึกไฟล์
            await writeFile(filePath, qrBuffer);

            console.log(`📸 QR Code image saved: ${filePath}`);
            return filePath;
        } catch (error) {
            console.error('❌ Failed to generate QR image:', error);
            return null;
        }
    }

    /**
     * สร้าง QR Code เป็น Data URL
     */
    async generateQRDataURL(qrString: string): Promise<string | null> {
        try {
            const qrOptions = {
                type: 'png' as const,
                quality: 0.92,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 512,
                errorCorrectionLevel: 'M' as const
            };

            const qrOptionsWithType = {
                ...qrOptions,
                type: 'image/png' as const
            };

            const dataURL = await QRCode.toDataURL(qrString, qrOptionsWithType);
            console.log('📸 QR Code data URL generated');
            return dataURL;
        } catch (error) {
            console.error('❌ Failed to generate QR data URL:', error);
            return null;
        }
    }

    /**
     * ลบไฟล์ QR Code เก่า (เก็บไว้แค่ 5 ไฟล์ล่าสุด)
     */
    async cleanupOldQRCodes(): Promise<void> {
        try {
            const files = fs.readdirSync(this.qrFolder)
                .filter(file => file.endsWith('.png'))
                .map(file => ({
                    name: file,
                    path: join(this.qrFolder, file),
                    time: fs.statSync(join(this.qrFolder, file)).mtime.getTime()
                }))
                .sort((a, b) => b.time - a.time);

            // ลบไฟล์เก่าที่เกิน 5 ไฟล์
            if (files.length > 5) {
                const filesToDelete = files.slice(5);
                for (const file of filesToDelete) {
                    fs.unlinkSync(file.path);
                    console.log(`🗑️ Deleted old QR file: ${file.name}`);
                }
            }
        } catch (error) {
            console.error('❌ Failed to cleanup old QR codes:', error);
        }
    }

    /**
     * รับ path ของโฟลเดอร์ QR codes
     */
    getQRFolderPath(): string {
        return this.qrFolder;
    }
}

// สร้าง instance เดียวสำหรับใช้ทั่วทั้งแอป
export const qrCodeGenerator = new QRCodeGenerator();
