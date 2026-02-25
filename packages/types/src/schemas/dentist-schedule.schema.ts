import { z } from 'zod';

export const DentistScheduleSchema = z.object({
  id: z.string(),
  dentistId: z.string(),
  dayOfWeek: z.number().int().min(0).max(6), // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // "HH:MM"
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotMinutes: z.number().int().positive(),
});

export type DentistSchedule = z.infer<typeof DentistScheduleSchema>;
