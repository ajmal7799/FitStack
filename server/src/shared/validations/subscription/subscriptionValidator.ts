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
  .int("Duration must be a whole number")
  .min(1, "Minimum duration is 1 month")
  .max(36, "Maximum duration is 36 months"),
  description: z
    .string()
    .min(1, "Description is required")
});

