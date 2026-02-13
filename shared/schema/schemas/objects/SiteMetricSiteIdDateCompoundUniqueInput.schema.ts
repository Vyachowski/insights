import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  siteId: z.number().int(),
  date: z.date()
}).strict();
export const SiteMetricSiteIdDateCompoundUniqueInputObjectSchema: z.ZodType<Prisma.SiteMetricSiteIdDateCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricSiteIdDateCompoundUniqueInput>;
export const SiteMetricSiteIdDateCompoundUniqueInputObjectZodSchema = makeSchema();
