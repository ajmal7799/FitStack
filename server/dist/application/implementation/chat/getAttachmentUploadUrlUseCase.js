"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAttachmentUploadUrlUseCase = void 0;
const storageFolderNameEnums_1 = require("../../../domain/enum/storageFolderNameEnums");
class GetAttachmentUploadUrlUseCase {
    constructor(_storageService) {
        this._storageService = _storageService;
    }
    execute(chatId, fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            const ext = fileName.split('.').pop();
            const key = `${storageFolderNameEnums_1.StorageFolderNameEnums.CHAT_ATTACHMENTS}/${chatId}/${Date.now()}.${ext}`;
            const uploadUrl = yield this._storageService.createPresignedUploadUrl(key, fileType, 5 * 60);
            return { uploadUrl, key };
        });
    }
}
exports.GetAttachmentUploadUrlUseCase = GetAttachmentUploadUrlUseCase;
