export interface IStorageService {
  upload(file: Express.Multer.File| Buffer, key: string): Promise<string>;
  createSignedUrl(key: string, expiary: number): Promise<string>;
  createPresignedUploadUrl(key: string, fileType: string, expiry: number): Promise<string>; // ← add

}