import { z } from 'zod';

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  durationMins: z.number().int().positive(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Service = z.infer<typeof ServiceSchema>;
