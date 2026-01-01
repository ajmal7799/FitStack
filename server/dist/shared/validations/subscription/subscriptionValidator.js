"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscriptionSchema = exports.createSubscriptionSchema = void 0;
const zod_1 = require("zod");
exports.createSubscriptionSchema = zod_1.z.object({
    planName: zod_1.z
        .string()
        .min(1, 'Plan name is required'),
    price: zod_1.z
        .number()
        .refine((val) => val > 0, {
        message: 'Price must be greater than 0',
    }),
    durationMonths: zod_1.z
        .number()
        .int('Duration must be a whole number')
        .min(1, 'Minimum duration is 1 month')
        .max(36, 'Maximum duration is 36 months'),
    description: zod_1.z
        .string()
        .min(1, 'Description is required'),
});
exports.updateSubscriptionSchema = exports.createSubscriptionSchema.partial();
