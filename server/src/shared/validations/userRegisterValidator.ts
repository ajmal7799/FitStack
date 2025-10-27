import z from "zod";
import { emailSchema } from "./emailValidator";

export const registerUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password cannot exceed 20 characters"),
  phone: z.string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  otp: z.string().min(6),
  // role: z.enum(UserRole),
});