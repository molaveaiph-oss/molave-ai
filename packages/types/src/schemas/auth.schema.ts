import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
