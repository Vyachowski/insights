import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { CityOrderByWithRelationInputObjectSchema as CityOrderByWithRelationInputObjectSchema } from './CityOrderByWithRelationInput.schema';
import { CallOrderByRelationAggregateInputObjectSchema as CallOrderByRelationAggregateInputObjectSchema } from './CallOrderByRelationAggregateInput.schema';
import { CallImportOrderByRelationAggregateInputObjectSchema as CallImportOrderByRelationAggregateInputObjectSchema } from './CallImportOrderByRelationAggregateInput.schema';
import { SiteMetricOrderByRelationAggregateInputObjectSchema as SiteMetricOrderByRelationAggregateInputObjectSchema } from './SiteMetricOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  yandex_counter_id: SortOrderSchema.optional(),
  google_counter_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  yandex_tag_manager_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  google_tag_manager_id: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  city: z.lazy(() => CityOrderByWithRelationInputObjectSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputObjectSchema).optional(),
  callsRaw: z.lazy(() => CallImportOrderByRelationAggregateInputObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const SiteOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SiteOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteOrderByWithRelationInput>;
export const SiteOrderByWithRelationInputObjectZodSchema = makeSchema();
