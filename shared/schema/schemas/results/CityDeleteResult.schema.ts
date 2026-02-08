import * as z from 'zod';
export const CityDeleteResultSchema = z.nullable(z.object({
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
}));