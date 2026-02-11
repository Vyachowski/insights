import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  city_id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  group: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  yandex_counter_id: SortOrderSchema.optional(),
  google_counter_id: SortOrderSchema.optional(),
  yandex_tag_manager_id: SortOrderSchema.optional(),
  google_tag_manager_id: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SiteMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SiteMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMaxOrderByAggregateInput>;
export const SiteMaxOrderByAggregateInputObjectZodSchema = makeSchema();
