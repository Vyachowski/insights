import * as z from 'zod';
export const CityFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.number().int(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sites: z.array(z.unknown()),
  revenues: z.array(z.unknown()),
  expenses: z.array(z.unknown())
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