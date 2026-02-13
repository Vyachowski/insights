import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ExpenseCountOrderByAggregateInputObjectSchema as ExpenseCountOrderByAggregateInputObjectSchema } from './ExpenseCountOrderByAggregateInput.schema';
import { ExpenseAvgOrderByAggregateInputObjectSchema as ExpenseAvgOrderByAggregateInputObjectSchema } from './ExpenseAvgOrderByAggregateInput.schema';
import { ExpenseMaxOrderByAggregateInputObjectSchema as ExpenseMaxOrderByAggregateInputObjectSchema } from './ExpenseMaxOrderByAggregateInput.schema';
import { ExpenseMinOrderByAggregateInputObjectSchema as ExpenseMinOrderByAggregateInputObjectSchema } from './ExpenseMinOrderByAggregateInput.schema';
import { ExpenseSumOrderByAggregateInputObjectSchema as ExpenseSumOrderByAggregateInputObjectSchema } from './ExpenseSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  cityId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  date: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  comment: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ExpenseCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ExpenseAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ExpenseMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ExpenseMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ExpenseSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ExpenseOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ExpenseOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ExpenseOrderByWithAggregationInput>;
export const ExpenseOrderByWithAggregationInputObjectZodSchema = makeSchema();
