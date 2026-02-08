import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { SiteScalarRelationFilterObjectSchema as SiteScalarRelationFilterObjectSchema } from './SiteScalarRelationFilter.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const sitemetricwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SiteMetricWhereInputObjectSchema), z.lazy(() => SiteMetricWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SiteMetricWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SiteMetricWhereInputObjectSchema), z.lazy(() => SiteMetricWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  site_id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  yandex_users: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  google_users: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  other_users: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  visit_duration_yandex_in_sec: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  visit_duration_google_in_sec: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  visit_duration_other_in_sec: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  bounce_yandex: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  bounce_google: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  bounce_other: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  leads_yandex: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  leads_google: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  leads_other: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  site: z.union([z.lazy(() => SiteScalarRelationFilterObjectSchema), z.lazy(() => SiteWhereInputObjectSchema)]).optional()
}).strict();
export const SiteMetricWhereInputObjectSchema: z.ZodType<Prisma.SiteMetricWhereInput> = sitemetricwhereinputSchema as unknown as z.ZodType<Prisma.SiteMetricWhereInput>;
export const SiteMetricWhereInputObjectZodSchema = sitemetricwhereinputSchema;
