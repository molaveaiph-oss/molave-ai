import { z } from 'zod';

export const CreatePatientSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
});

export const UpdatePatientSchema = CreatePatientSchema.partial();

export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { appointments: number };
}
