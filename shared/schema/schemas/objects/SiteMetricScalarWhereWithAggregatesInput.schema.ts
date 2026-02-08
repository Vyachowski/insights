import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema as FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema'

const sitemetricscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => SiteMetricScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SiteMetricScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SiteMetricScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SiteMetricScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SiteMetricScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  site_id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  yandex_users: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  google_users: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  other_users: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  visit_duration_yandex_in_sec: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  visit_duration_google_in_sec: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  visit_duration_other_in_sec: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  bounce_yandex: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  bounce_google: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  bounce_other: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  leads_yandex: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  leads_google: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  leads_other: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional()
}).strict();
export const SiteMetricScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SiteMetricScalarWhereWithAggregatesInput> = sitemetricscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SiteMetricScalarWhereWithAggregatesInput>;
export const SiteMetricScalarWhereWithAggregatesInputObjectZodSchema = sitemetricscalarwherewithaggregatesinputSchema;
