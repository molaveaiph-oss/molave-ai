import { z } from 'zod';

export const PublicBookingRequestSchema = z.object({
  branchId: z.string().min(1),
  serviceId: z.string().min(1),
  dentistId: z.string().min(1).nullable(), // null = "No Preference"
  scheduledAt: z.string().datetime(),
  patientName: z.string().min(1).max(100),
  patientPhone: z.string().min(7).max(20),
  patientEmail: z.string().email().optional().nullable(),
  isFirstVisit: z.boolean(),
});

export const PublicBookingResponseSchema = z.object({
  appointmentId: z.string(),
  referenceNumber: z.string(),
  confirmedAt: z.string(),
});

export const PublicPatientLookupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
}).nullable();

export type PublicBookingRequest = z.infer<typeof PublicBookingRequestSchema>;
export type PublicBookingResponse = z.infer<typeof PublicBookingResponseSchema>;
export type PublicPatientLookupResponse = z.infer<typeof PublicPatientLookupResponseSchema>;
