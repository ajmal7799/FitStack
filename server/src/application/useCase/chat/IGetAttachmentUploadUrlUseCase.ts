

export interface IGetAttachmentUploadUrlUseCase {
    execute(chatId: string, fileName: string, fileType: string): Promise<{uploadUrl: string; key: string}>;
}