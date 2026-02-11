import * as z from 'zod';

export const CitySchema = z.object({
  id: z.number().int(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CityType = z.infer<typeof CitySchema>;
