import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  cityId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const RevenueMinAggregateInputObjectSchema: z.ZodType<Prisma.RevenueMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.RevenueMinAggregateInputType>;
export const RevenueMinAggregateInputObjectZodSchema = makeSchema();
