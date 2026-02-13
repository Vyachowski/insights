import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CallImportCountOrderByAggregateInputObjectSchema as CallImportCountOrderByAggregateInputObjectSchema } from './CallImportCountOrderByAggregateInput.schema';
import { CallImportAvgOrderByAggregateInputObjectSchema as CallImportAvgOrderByAggregateInputObjectSchema } from './CallImportAvgOrderByAggregateInput.schema';
import { CallImportMaxOrderByAggregateInputObjectSchema as CallImportMaxOrderByAggregateInputObjectSchema } from './CallImportMaxOrderByAggregateInput.schema';
import { CallImportMinOrderByAggregateInputObjectSchema as CallImportMinOrderByAggregateInputObjectSchema } from './CallImportMinOrderByAggregateInput.schema';
import { CallImportSumOrderByAggregateInputObjectSchema as CallImportSumOrderByAggregateInputObjectSchema } from './CallImportSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  region: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  callNumber: SortOrderSchema.optional(),
  class: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  projectTitle: SortOrderSchema.optional(),
  advChannelName: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  comment: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  redirectNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  source: SortOrderSchema.optional(),
  importedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => CallImportCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => CallImportAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => CallImportMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => CallImportMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => CallImportSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const CallImportOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.CallImportOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportOrderByWithAggregationInput>;
export const CallImportOrderByWithAggregationInputObjectZodSchema = makeSchema();
