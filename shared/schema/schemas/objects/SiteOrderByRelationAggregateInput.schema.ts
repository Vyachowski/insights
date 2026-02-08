import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SiteOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SiteOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteOrderByRelationAggregateInput>;
export const SiteOrderByRelationAggregateInputObjectZodSchema = makeSchema();
