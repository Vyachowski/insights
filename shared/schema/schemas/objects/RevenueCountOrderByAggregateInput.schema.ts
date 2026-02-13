import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  cityId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const RevenueCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RevenueCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueCountOrderByAggregateInput>;
export const RevenueCountOrderByAggregateInputObjectZodSchema = makeSchema();
