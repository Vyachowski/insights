import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { RevenueCountOrderByAggregateInputObjectSchema as RevenueCountOrderByAggregateInputObjectSchema } from './RevenueCountOrderByAggregateInput.schema';
import { RevenueAvgOrderByAggregateInputObjectSchema as RevenueAvgOrderByAggregateInputObjectSchema } from './RevenueAvgOrderByAggregateInput.schema';
import { RevenueMaxOrderByAggregateInputObjectSchema as RevenueMaxOrderByAggregateInputObjectSchema } from './RevenueMaxOrderByAggregateInput.schema';
import { RevenueMinOrderByAggregateInputObjectSchema as RevenueMinOrderByAggregateInputObjectSchema } from './RevenueMinOrderByAggregateInput.schema';
import { RevenueSumOrderByAggregateInputObjectSchema as RevenueSumOrderByAggregateInputObjectSchema } from './RevenueSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  cityId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  date: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => RevenueCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => RevenueAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => RevenueMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => RevenueMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => RevenueSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const RevenueOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.RevenueOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueOrderByWithAggregationInput>;
export const RevenueOrderByWithAggregationInputObjectZodSchema = makeSchema();
