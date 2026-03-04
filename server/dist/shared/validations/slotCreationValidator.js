"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotCreationSchema = void 0;
const zod_1 = require("zod");
exports.slotCreationSchema = zod_1.z.object({
    startTime: zod_1.z
        .string({ message: 'Start time is required' })
        .datetime({ message: 'Invalid ISO format' })
        .refine((val) => {
        const inputDate = new Date(val);
        const now = new Date();
        // Added a small buffer (e.g., 1 minute) to avoid "past date" 
        // errors caused by network latency during testing.
        return inputDate.getTime() > now.getTime();
    }, {
        message: 'Start time must be in the future',
    }),
});
