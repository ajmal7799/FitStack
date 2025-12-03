import { z } from 'zod';
import { tr } from 'zod/locales';

const MulterFileSchema = z
    .object({
        fieldname: z.string(),
        originalname: z.string(),
        mimetype: z.string(),
    // We don't need to validate all Multer properties, just that the object is present
    })
    .passthrough();

export const trainerVerificationSchema = z.object({
    trainerId: z.string().min(1, 'Invalid Trainer ID.'),
    qualification: z.string().min(2, 'Qualification must be at least 2 characters long'),
    specialisation: z.string().min(2, 'Specialisation must be at least 2 characters long.'),
    experience: z.coerce.number().min(0, 'Experience must be 0 or more years.'),
    about: z.string().min(20, 'About me must be at least 20 characters.'),
 

    idCard: z.any().refine(v => !!v, 'ID Card is required'),
    educationCert: z.any().refine(v => !!v, 'Education Certificate is required'),
    experienceCert: z.any().refine(v => !!v, 'Experience Proof is required'),
});
