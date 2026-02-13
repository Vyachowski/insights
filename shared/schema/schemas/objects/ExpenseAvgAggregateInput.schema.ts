import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  cityId: z.literal(true).optional(),
  amount: z.literal(true).optional()
}).strict();
export const ExpenseAvgAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseAvgAggregateInputType>;
export const ExpenseAvgAggregateInputObjectZodSchema = makeSchema();
