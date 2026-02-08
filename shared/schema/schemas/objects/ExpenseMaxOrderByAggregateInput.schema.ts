import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  comment: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ExpenseMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ExpenseMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseMaxOrderByAggregateInput>;
export const ExpenseMaxOrderByAggregateInputObjectZodSchema = makeSchema();
