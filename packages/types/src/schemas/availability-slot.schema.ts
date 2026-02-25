import { z } from 'zod';

export const AvailabilitySlotSchema = z.object({
  time: z.string(), // ISO datetime string
  available: z.boolean(),
  dentistId: z.string().optional(),
  dentistName: z.string().optional(),
});

export const AvailabilityResponseSchema = z.object({
  slots: z.array(AvailabilitySlotSchema),
  isClosure: z.boolean(),
  closureReason: z.string().optional(),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;
