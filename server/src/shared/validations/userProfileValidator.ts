import z from 'zod';
import { emailSchema } from './emailValidator';


export const userProfile = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: emailSchema,
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  profileImage: z.any().optional(),

});

export const userPersonalInfoSchema = userProfile.partial();