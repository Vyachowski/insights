import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  population: z.literal(true).optional()
}).strict();
export const CitySumAggregateInputObjectSchema: z.ZodType<Prisma.CitySumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CitySumAggregateInputType>;
export const CitySumAggregateInputObjectZodSchema = makeSchema();
