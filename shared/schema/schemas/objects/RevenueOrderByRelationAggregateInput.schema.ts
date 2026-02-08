import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const RevenueOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.RevenueOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.RevenueOrderByRelationAggregateInput>;
export const RevenueOrderByRelationAggregateInputObjectZodSchema = makeSchema();
