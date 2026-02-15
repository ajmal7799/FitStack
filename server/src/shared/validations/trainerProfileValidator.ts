import z from 'zod';
import { emailSchema } from './emailValidator';

export const trainerProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: emailSchema,
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    profileImage: z.any().optional(),
    qualification: z.string().min(2, 'Qualification must be at least 2 characters long'),
    specialisation: z.string().min(2, 'Specialisation must be at least 2 characters long.'),
    experience: z.coerce.number().min(0, 'Experience must be 0 or more years.'),
    about: z.string().min(20, 'About me must be at least 20 characters.'),
  
});

export const updateTrainerProfileSchema = trainerProfileSchema.partial();
