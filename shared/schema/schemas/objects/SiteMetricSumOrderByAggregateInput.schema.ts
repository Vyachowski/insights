import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  siteId: SortOrderSchema.optional(),
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
export const SiteMetricSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SiteMetricSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricSumOrderByAggregateInput>;
export const SiteMetricSumOrderByAggregateInputObjectZodSchema = makeSchema();
