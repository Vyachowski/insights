import * as z from 'zod';
export const RevenueFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.number().int(),
  cityId: z.number().int().optional(),
  date: z.date(),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  city: z.unknown().optional()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});