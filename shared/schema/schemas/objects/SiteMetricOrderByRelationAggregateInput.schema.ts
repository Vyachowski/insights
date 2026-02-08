import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SiteMetricOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SiteMetricOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricOrderByRelationAggregateInput>;
export const SiteMetricOrderByRelationAggregateInputObjectZodSchema = makeSchema();
