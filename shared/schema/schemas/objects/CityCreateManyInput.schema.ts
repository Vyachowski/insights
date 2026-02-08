import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const CityCreateManyInputObjectSchema: z.ZodType<Prisma.CityCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CityCreateManyInput>;
export const CityCreateManyInputObjectZodSchema = makeSchema();
