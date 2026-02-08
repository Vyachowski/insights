import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  call_number: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional()
}).strict();
export const CallImportAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallImportAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportAvgOrderByAggregateInput>;
export const CallImportAvgOrderByAggregateInputObjectZodSchema = makeSchema();
