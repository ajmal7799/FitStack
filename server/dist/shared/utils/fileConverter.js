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
exports.multerFileToFileConverter = multerFileToFileConverter;
exports.fileToBuffer = fileToBuffer;
const error_1 = require("../constants/error");
function multerFileToFileConverter(multerFile) {
    const file = new File([new Uint8Array(multerFile.buffer)], multerFile.originalname, {
        type: multerFile.mimetype,
    });
    return file;
}
function fileToBuffer(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const arrayBuffer = yield file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return buffer;
        }
        catch (error) {
            console.log('', error);
            throw new Error(error_1.Errors.CONVERSTION_ERROR);
        }
    });
}
