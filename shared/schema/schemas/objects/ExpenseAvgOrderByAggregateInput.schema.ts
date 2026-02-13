import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  cityId: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional()
}).strict();
export const ExpenseAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseAvgOrderByAggregateInput>;
export const ExpenseAvgOrderByAggregateInputObjectZodSchema = makeSchema();
