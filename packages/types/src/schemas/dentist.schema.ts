import { z } from 'zod';
import { DentistScheduleSchema } from './dentist-schedule.schema';

export const DentistSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  branchId: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DentistWithScheduleSchema = DentistSchema.extend({
  schedules: z.array(DentistScheduleSchema),
});

export type Dentist = z.infer<typeof DentistSchema>;
export type DentistWithSchedule = z.infer<typeof DentistWithScheduleSchema>;
