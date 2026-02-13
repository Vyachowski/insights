import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  cityId: SortOrderSchema.optional()
}).strict();
export const SiteAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SiteAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteAvgOrderByAggregateInput>;
export const SiteAvgOrderByAggregateInputObjectZodSchema = makeSchema();
