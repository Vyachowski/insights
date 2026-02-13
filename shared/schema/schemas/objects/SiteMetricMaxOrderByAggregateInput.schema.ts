import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
  date: SortOrderSchema.optional(),
  yandexUsers: SortOrderSchema.optional(),
  googleUsers: SortOrderSchema.optional(),
  otherUsers: SortOrderSchema.optional(),
  visitDurationYandexInSec: SortOrderSchema.optional(),
  visitDurationGoogleInSec: SortOrderSchema.optional(),
  visitDurationOtherInSec: SortOrderSchema.optional(),
  bounceYandex: SortOrderSchema.optional(),
  bounceGoogle: SortOrderSchema.optional(),
  bounceOther: SortOrderSchema.optional(),
  leadsYandex: SortOrderSchema.optional(),
  leadsGoogle: SortOrderSchema.optional(),
  leadsOther: SortOrderSchema.optional()
}).strict();
export const SiteMetricMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SiteMetricMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricMaxOrderByAggregateInput>;
export const SiteMetricMaxOrderByAggregateInputObjectZodSchema = makeSchema();
