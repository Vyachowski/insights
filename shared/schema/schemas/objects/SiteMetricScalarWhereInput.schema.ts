import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema'

const sitemetricscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SiteMetricScalarWhereInputObjectSchema), z.lazy(() => SiteMetricScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SiteMetricScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SiteMetricScalarWhereInputObjectSchema), z.lazy(() => SiteMetricScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  siteId: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  yandexUsers: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  googleUsers: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  otherUsers: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  visitDurationYandexInSec: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  visitDurationGoogleInSec: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  visitDurationOtherInSec: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  bounceYandex: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  bounceGoogle: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  bounceOther: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  leadsYandex: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  leadsGoogle: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  leadsOther: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional()
}).strict();
export const SiteMetricScalarWhereInputObjectSchema: z.ZodType<Prisma.SiteMetricScalarWhereInput> = sitemetricscalarwhereinputSchema as unknown as z.ZodType<Prisma.SiteMetricScalarWhereInput>;
export const SiteMetricScalarWhereInputObjectZodSchema = sitemetricscalarwhereinputSchema;
