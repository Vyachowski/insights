import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  code: z.literal(true).optional(),
  slug: z.literal(true).optional(),
  name: z.literal(true).optional(),
  population: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const CityMaxAggregateInputObjectSchema: z.ZodType<Prisma.CityMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CityMaxAggregateInputType>;
export const CityMaxAggregateInputObjectZodSchema = makeSchema();
