import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CityCountOrderByAggregateInputObjectSchema as CityCountOrderByAggregateInputObjectSchema } from './CityCountOrderByAggregateInput.schema';
import { CityAvgOrderByAggregateInputObjectSchema as CityAvgOrderByAggregateInputObjectSchema } from './CityAvgOrderByAggregateInput.schema';
import { CityMaxOrderByAggregateInputObjectSchema as CityMaxOrderByAggregateInputObjectSchema } from './CityMaxOrderByAggregateInput.schema';
import { CityMinOrderByAggregateInputObjectSchema as CityMinOrderByAggregateInputObjectSchema } from './CityMinOrderByAggregateInput.schema';
import { CitySumOrderByAggregateInputObjectSchema as CitySumOrderByAggregateInputObjectSchema } from './CitySumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  population: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CityCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CityAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CityMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CityMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CitySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CityOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CityOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CityOrderByWithAggregationInput>;
export const CityOrderByWithAggregationInputObjectZodSchema = makeSchema();
