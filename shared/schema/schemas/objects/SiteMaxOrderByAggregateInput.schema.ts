import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  cityId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  group: SortOrderSchema.optional(),
  url: SortOrderSchema.optional(),
  yandexCounterId: SortOrderSchema.optional(),
  googleCounterId: SortOrderSchema.optional(),
  yandexTagManagerId: SortOrderSchema.optional(),
  googleTagManagerId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SiteMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SiteMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMaxOrderByAggregateInput>;
export const SiteMaxOrderByAggregateInputObjectZodSchema = makeSchema();
