import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CONFIG } from '../../config/config';
import { IStorageService } from '../../../domain/interfaces/services/IStorage/IStorageService';
import { Errors } from '../../../shared/constants/error';
import { fileToBuffer } from '../../../shared/utils/fileConverter';


export class StorageService implements IStorageService {
    private _s3Client: S3Client;

    constructor() {
        this._s3Client = new S3Client({
            region: CONFIG.AWS_REGION,
            credentials: {
                accessKeyId: CONFIG.AWS_ACCESS_KEY_ID!,
                secretAccessKey: CONFIG.AWS_SECRET_ACCESS_KEY!,
            },
            requestChecksumCalculation: 'WHEN_REQUIRED',   // ← add this
        responseChecksumValidation: 'WHEN_REQUIRED', 
        });
    }
    async upload(file: File | Buffer, key: string): Promise<string> {
        const data = 
        file instanceof Buffer ?file: file instanceof File ? await fileToBuffer(file) : file;
        try {
            const command = new PutObjectCommand({
                Bucket: CONFIG.S3_BUCKET_NAME,
                Key: key,   
                Body: data,
            });
            await this._s3Client.send(command);
            return key;
            
        } catch (error) {
            throw new Error(Errors.STORAGE_UPLOAD_ERROR);     
        }
    }
    async createSignedUrl(key: string, expiary: number): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: CONFIG.S3_BUCKET_NAME,
            Key: key,   
        });
        const signedUrl = await getSignedUrl(this._s3Client, command, { expiresIn: expiary });
        return signedUrl;
    }
  async createPresignedUploadUrl(key: string, fileType: string, expiry: number): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: CONFIG.S3_BUCKET_NAME,
        Key: key,
        // ← removed ContentType, no ChecksumAlgorithm
    });
    return await getSignedUrl(this._s3Client, command, { 
        expiresIn: expiry,
    });
}
    
}