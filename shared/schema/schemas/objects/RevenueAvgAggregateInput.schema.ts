import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  city_id: z.literal(true).optional(),
  amount: z.literal(true).optional()
}).strict();
export const RevenueAvgAggregateInputObjectSchema: z.ZodType<Prisma.RevenueAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RevenueAvgAggregateInputType>;
export const RevenueAvgAggregateInputObjectZodSchema = makeSchema();
