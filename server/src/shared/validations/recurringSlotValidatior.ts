import { z } from 'zod';

// Define valid weekdays for reuse
const WeekdaysEnum = z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);

export const recurringSlotSchema = z.object({
  // Validates YYYY-MM-DD
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
    message: "Start date must be in YYYY-MM-DD format" 
  }),
  
  // Validates YYYY-MM-DD
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
    message: "End date must be in YYYY-MM-DD format" 
  }),
  
  // Validates HH:mm (24-hour format)
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { 
    message: "Start time must be in HH:mm format (24h)" 
  }),
  
  // Ensures at least one day is selected and no duplicates
  weekdays: z.array(WeekdaysEnum).min(1, { 
    message: "Select at least one weekday" 
  }),
})
.refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Clear time for date-only comparison

  // 1. Ensure end date is not before start date
  // 2. Ensure start date is not in the past
  return end >= start && start >= today;
}, {
  message: "End date must be after start date, and start date cannot be in the past",
  path: ["endDate"], // This shows the error on the endDate field
});