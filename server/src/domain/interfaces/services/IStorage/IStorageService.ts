export interface IStorageService {
  upload(file: File | Buffer| string, key: string): Promise<string>;
  createSignedUrl(key: string, expiary: number): Promise<string>;
  createPresignedUploadUrl(key: string, fileType: string, expiry: number): Promise<string>; // ← add

}