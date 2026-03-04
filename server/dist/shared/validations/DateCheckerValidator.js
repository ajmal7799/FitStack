"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlotsSchema = void 0;
const zod_1 = require("zod");
exports.getAvailableSlotsSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z
            .string({ message: 'Date is required' })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')
            .refine((dateString) => {
            // 1. Convert "2026-01-01" into a Date object at local midnight
            const selectedDate = new Date(`${dateString}T00:00:00`);
            // 2. Get the current "Now" but reset the clock to 00:00:00
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // 3. Compare: Today >= Today is now TRUE
            return selectedDate >= today;
        }, { message: 'Cannot search for slots in the past' }),
    }),
});
