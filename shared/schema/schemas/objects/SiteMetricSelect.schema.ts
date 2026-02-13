import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteArgsObjectSchema as SiteArgsObjectSchema } from './SiteArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  siteId: z.boolean().optional(),
  date: z.boolean().optional(),
  yandexUsers: z.boolean().optional(),
  googleUsers: z.boolean().optional(),
  otherUsers: z.boolean().optional(),
  visitDurationYandexInSec: z.boolean().optional(),
  visitDurationGoogleInSec: z.boolean().optional(),
  visitDurationOtherInSec: z.boolean().optional(),
  bounceYandex: z.boolean().optional(),
  bounceGoogle: z.boolean().optional(),
  bounceOther: z.boolean().optional(),
  leadsYandex: z.boolean().optional(),
  leadsGoogle: z.boolean().optional(),
  leadsOther: z.boolean().optional(),
  site: z.union([z.boolean(), z.lazy(() => SiteArgsObjectSchema)]).optional()
}).strict();
export const SiteMetricSelectObjectSchema: z.ZodType<Prisma.SiteMetricSelect> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricSelect>;
export const SiteMetricSelectObjectZodSchema = makeSchema();
