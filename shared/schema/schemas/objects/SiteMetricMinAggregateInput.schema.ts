import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  siteId: z.literal(true).optional(),
  date: z.literal(true).optional(),
  yandexUsers: z.literal(true).optional(),
  googleUsers: z.literal(true).optional(),
  otherUsers: z.literal(true).optional(),
  visitDurationYandexInSec: z.literal(true).optional(),
  visitDurationGoogleInSec: z.literal(true).optional(),
  visitDurationOtherInSec: z.literal(true).optional(),
  bounceYandex: z.literal(true).optional(),
  bounceGoogle: z.literal(true).optional(),
  bounceOther: z.literal(true).optional(),
  leadsYandex: z.literal(true).optional(),
  leadsGoogle: z.literal(true).optional(),
  leadsOther: z.literal(true).optional()
}).strict();
export const SiteMetricMinAggregateInputObjectSchema: z.ZodType<Prisma.SiteMetricMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricMinAggregateInputType>;
export const SiteMetricMinAggregateInputObjectZodSchema = makeSchema();
