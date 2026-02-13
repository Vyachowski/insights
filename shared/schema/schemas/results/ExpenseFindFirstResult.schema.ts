import * as z from 'zod';
export const ExpenseFindFirstResultSchema = z.nullable(z.object({
  id: z.number().int(),
  cityId: z.number().int().optional(),
  date: z.date(),
  amount: z.number(),
  type: z.string(),
  comment: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  city: z.unknown().optional()
}));