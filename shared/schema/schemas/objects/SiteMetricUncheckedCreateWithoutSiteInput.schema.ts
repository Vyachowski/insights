import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  date: z.coerce.date(),
  yandexUsers: z.number().int().optional(),
  googleUsers: z.number().int().optional(),
  otherUsers: z.number().int().optional(),
  visitDurationYandexInSec: z.number().optional(),
  visitDurationGoogleInSec: z.number().optional(),
  visitDurationOtherInSec: z.number().optional(),
  bounceYandex: z.number().optional(),
  bounceGoogle: z.number().optional(),
  bounceOther: z.number().optional(),
  leadsYandex: z.number().int().optional(),
  leadsGoogle: z.number().int().optional(),
  leadsOther: z.number().int().optional()
}).strict();
export const SiteMetricUncheckedCreateWithoutSiteInputObjectSchema: z.ZodType<Prisma.SiteMetricUncheckedCreateWithoutSiteInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricUncheckedCreateWithoutSiteInput>;
export const SiteMetricUncheckedCreateWithoutSiteInputObjectZodSchema = makeSchema();
