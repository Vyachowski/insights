import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricSiteIdDateCompoundUniqueInputObjectSchema as SiteMetricSiteIdDateCompoundUniqueInputObjectSchema } from './SiteMetricSiteIdDateCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  siteId_date: z.lazy(() => SiteMetricSiteIdDateCompoundUniqueInputObjectSchema).optional()
}).strict();
export const SiteMetricWhereUniqueInputObjectSchema: z.ZodType<Prisma.SiteMetricWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricWhereUniqueInput>;
export const SiteMetricWhereUniqueInputObjectZodSchema = makeSchema();
