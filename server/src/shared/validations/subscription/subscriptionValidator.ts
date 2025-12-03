import { z } from "zod";

export const createSubscriptionSchema = z.object({
  planName: z
    .string()
    .min(1, "Plan name is required"),

  price: z
    .number()
    .refine((val) => val > 0, {
      message: "Price must be greater than 0"
    }),

  durationMonths: z
    .number()
    .int("Duration must be an integer")
    .refine((val) => val > 0, {
      message: "Duration must be greater than 0"
    }),

  description: z
    .string()
    .min(1, "Description is required")
});

