import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  site_id: SortOrderSchema.optional(),
  call_number: SortOrderSchema.optional(),
  billsec: SortOrderSchema.optional()
}).strict();
export const CallImportSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CallImportSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallImportSumOrderByAggregateInput>;
export const CallImportSumOrderByAggregateInputObjectZodSchema = makeSchema();
