import * as z from 'zod';
export const RevenueFindUniqueResultSchema = z.nullable(z.object({
  id: z.number().int(),
  cityId: z.number().int().optional(),
  date: z.date(),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  city: z.unknown().optional()
}));