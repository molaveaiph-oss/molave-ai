import { z } from 'zod';

export const APPOINTMENT_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const CreateAppointmentSchema = z.object({
  patientId: z.string().min(1),
  branchId: z.string().min(1),
  serviceId: z.string().min(1),
  dentistId: z.string().optional().nullable(),
  title: z.string().max(200).optional(),
  notes: z.string().optional(),
  scheduledAt: z.string().datetime(),
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial().extend({
  status: z.enum(APPOINTMENT_STATUSES).optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentSchema>;

export interface Appointment {
  id: string;
  patientId: string;
  patient?: { id: string; name: string; email: string | null };
  branchId: string;
  serviceId: string;
  dentistId: string | null;
  referenceNumber: string;
  title: string | null;
  notes: string | null;
  scheduledAt: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}
