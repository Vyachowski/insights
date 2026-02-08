import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SiteOrderByRelationAggregateInputObjectSchema as SiteOrderByRelationAggregateInputObjectSchema } from './SiteOrderByRelationAggregateInput.schema';
import { RevenueOrderByRelationAggregateInputObjectSchema as RevenueOrderByRelationAggregateInputObjectSchema } from './RevenueOrderByRelationAggregateInput.schema';
import { ExpenseOrderByRelationAggregateInputObjectSchema as ExpenseOrderByRelationAggregateInputObjectSchema } from './ExpenseOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  slug: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  population: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  sites: z.lazy(() => SiteOrderByRelationAggregateInputObjectSchema).optional(),
  revenues: z.lazy(() => RevenueOrderByRelationAggregateInputObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const CityOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CityOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CityOrderByWithRelationInput>;
export const CityOrderByWithRelationInputObjectZodSchema = makeSchema();
