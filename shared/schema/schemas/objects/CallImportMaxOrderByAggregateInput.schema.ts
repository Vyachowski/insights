import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  region: SortOrderSchema.optional(),
  callNumber: SortOrderSchema.optional(),
  class: SortOrderSchema.optional(),
  projectTitle: SortOrderSchema.optional(),
  advChannelName: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  comment: SortOrderSchema.optional(),
  redirectNumber: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  importedAt: SortOrderSchema.optional()
}).strict();
export const CallImportMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallImportMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportMaxOrderByAggregateInput>;
export const CallImportMaxOrderByAggregateInputObjectZodSchema = makeSchema();
