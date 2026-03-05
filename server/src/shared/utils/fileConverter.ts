import { Errors } from '../constants/error';

export function multerFileToFileConverter(multerFile: Express.Multer.File): Express.Multer.File {
    return multerFile;
}

export async function fileToBuffer(multerFile: Express.Multer.File): Promise<Buffer> {
    try {
        return multerFile.buffer;
    } catch (error) {
        console.log('', error);
        throw new Error(Errors.CONVERSTION_ERROR);
    }
}