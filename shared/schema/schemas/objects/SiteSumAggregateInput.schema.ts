import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  city_id: z.literal(true).optional()
}).strict();
export const SiteSumAggregateInputObjectSchema: z.ZodType<Prisma.SiteSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SiteSumAggregateInputType>;
export const SiteSumAggregateInputObjectZodSchema = makeSchema();
