import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  city_id: z.literal(true).optional()
}).strict();
export const SiteAvgAggregateInputObjectSchema: z.ZodType<Prisma.SiteAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SiteAvgAggregateInputType>;
export const SiteAvgAggregateInputObjectZodSchema = makeSchema();
