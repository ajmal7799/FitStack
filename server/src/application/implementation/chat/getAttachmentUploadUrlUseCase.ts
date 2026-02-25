import { IGetAttachmentUploadUrlUseCase } from "../../useCase/chat/IGetAttachmentUploadUrlUseCase";
import { IStorageService } from "../../../domain/interfaces/services/IStorage/IStorageService";
import { StorageFolderNameEnums } from "../../../domain/enum/storageFolderNameEnums";

export class GetAttachmentUploadUrlUseCase implements IGetAttachmentUploadUrlUseCase {
    constructor(private  _storageService: IStorageService) {}
   
    async execute(chatId: string, fileName: string, fileType: string): Promise<{ uploadUrl: string; key: string }> {
        const ext = fileName.split('.').pop();
        const key = `${StorageFolderNameEnums.CHAT_ATTACHMENTS}/${chatId}/${Date.now()}.${ext}`;

        const uploadUrl = await this._storageService.createPresignedUploadUrl(
            key,
            fileType,
            5 * 60  // 5 minutes to upload
        );

        return { uploadUrl, key };
    }
}

