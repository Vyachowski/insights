import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  city_id: z.literal(true).optional(),
  date: z.literal(true).optional(),
  amount: z.literal(true).optional(),
  type: z.literal(true).optional(),
  comment: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ExpenseCountAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseCountAggregateInputType>;
export const ExpenseCountAggregateInputObjectZodSchema = makeSchema();
