"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerVerificationSchema = void 0;
const zod_1 = require("zod");
const MulterFileSchema = zod_1.z
    .object({
    fieldname: zod_1.z.string(),
    originalname: zod_1.z.string(),
    mimetype: zod_1.z.string(),
    // We don't need to validate all Multer properties, just that the object is present
})
    .passthrough();
exports.trainerVerificationSchema = zod_1.z.object({
    trainerId: zod_1.z.string().min(1, 'Invalid Trainer ID.'),
    qualification: zod_1.z.string().min(2, 'Qualification must be at least 2 characters long'),
    specialisation: zod_1.z.string().min(2, 'Specialisation must be at least 2 characters long.'),
    experience: zod_1.z.coerce.number().min(0, 'Experience must be 0 or more years.'),
    about: zod_1.z.string().min(20, 'About me must be at least 20 characters.'),
    idCard: zod_1.z.any().refine(v => !!v, 'ID Card is required'),
    educationCert: zod_1.z.any().refine(v => !!v, 'Education Certificate is required'),
    experienceCert: zod_1.z.any().refine(v => !!v, 'Experience Proof is required'),
});
