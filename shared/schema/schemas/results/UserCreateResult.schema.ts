import * as z from 'zod';
export const UserCreateResultSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.unknown(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date()
});