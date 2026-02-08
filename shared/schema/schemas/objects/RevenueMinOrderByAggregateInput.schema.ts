import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const RevenueMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RevenueMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueMinOrderByAggregateInput>;
export const RevenueMinOrderByAggregateInputObjectZodSchema = makeSchema();
