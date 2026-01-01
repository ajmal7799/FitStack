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
exports.StorageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("../../config/config");
const error_1 = require("../../../shared/constants/error");
const fileConverter_1 = require("../../../shared/utils/fileConverter");
class StorageService {
    constructor() {
        this._s3Client = new client_s3_1.S3Client({
            region: config_1.CONFIG.AWS_REGION,
            credentials: {
                accessKeyId: config_1.CONFIG.AWS_ACCESS_KEY_ID,
                secretAccessKey: config_1.CONFIG.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    upload(file, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = file instanceof Buffer ? file : file instanceof File ? yield (0, fileConverter_1.fileToBuffer)(file) : file;
            try {
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: config_1.CONFIG.S3_BUCKET_NAME,
                    Key: key,
                    Body: data,
                });
                yield this._s3Client.send(command);
                return key;
            }
            catch (error) {
                throw new Error(error_1.Errors.STORAGE_UPLOAD_ERROR);
            }
        });
    }
    createSignedUrl(key, expiary) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: config_1.CONFIG.S3_BUCKET_NAME,
                Key: key,
            });
            const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(this._s3Client, command, { expiresIn: expiary });
            return signedUrl;
        });
    }
}
exports.StorageService = StorageService;
