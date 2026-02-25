import { z } from 'zod';

export const BranchSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Branch = z.infer<typeof BranchSchema>;
