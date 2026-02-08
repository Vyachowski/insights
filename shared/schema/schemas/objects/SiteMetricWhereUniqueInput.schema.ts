import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteMetricSite_idDateCompoundUniqueInputObjectSchema as SiteMetricSite_idDateCompoundUniqueInputObjectSchema } from './SiteMetricSite_idDateCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.number().int().optional(),
  site_id_date: z.lazy(() => SiteMetricSite_idDateCompoundUniqueInputObjectSchema).optional()
}).strict();
export const SiteMetricWhereUniqueInputObjectSchema: z.ZodType<Prisma.SiteMetricWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricWhereUniqueInput>;
export const SiteMetricWhereUniqueInputObjectZodSchema = makeSchema();
