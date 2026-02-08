import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  city_id: z.literal(true).optional(),
  date: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const RevenueMaxAggregateInputObjectSchema: z.ZodType<Prisma.RevenueMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RevenueMaxAggregateInputType>;
export const RevenueMaxAggregateInputObjectZodSchema = makeSchema();
