import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  cityId: z.literal(true).optional(),
  amount: z.literal(true).optional()
}).strict();
export const ExpenseSumAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseSumAggregateInputType>;
export const ExpenseSumAggregateInputObjectZodSchema = makeSchema();
