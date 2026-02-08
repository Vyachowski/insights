import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  src: SortOrderSchema.optional(),
  region: SortOrderSchema.optional(),
  call_number: SortOrderSchema.optional(),
  class: SortOrderSchema.optional(),
  project_title: SortOrderSchema.optional(),
  adv_channel_name: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional(),
  comment: SortOrderSchema.optional(),
  redirect_number: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  imported_at: SortOrderSchema.optional()
}).strict();
export const CallImportCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallImportCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportCountOrderByAggregateInput>;
export const CallImportCountOrderByAggregateInputObjectZodSchema = makeSchema();
