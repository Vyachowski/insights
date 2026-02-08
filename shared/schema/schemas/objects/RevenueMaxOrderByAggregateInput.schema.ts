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
export const RevenueMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.RevenueMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueMaxOrderByAggregateInput>;
export const RevenueMaxOrderByAggregateInputObjectZodSchema = makeSchema();
