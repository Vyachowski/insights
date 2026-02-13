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
  siteId: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  yandexUsers: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  googleUsers: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  otherUsers: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  visitDurationYandexInSec: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  visitDurationGoogleInSec: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  visitDurationOtherInSec: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  bounceYandex: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  bounceGoogle: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  bounceOther: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  leadsYandex: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  leadsGoogle: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  leadsOther: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional()
}).strict();
export const SiteMetricScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SiteMetricScalarWhereWithAggregatesInput> = sitemetricscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SiteMetricScalarWhereWithAggregatesInput>;
export const SiteMetricScalarWhereWithAggregatesInputObjectZodSchema = sitemetricscalarwherewithaggregatesinputSchema;
