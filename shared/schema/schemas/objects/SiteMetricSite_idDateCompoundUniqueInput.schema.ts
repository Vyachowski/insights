import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  site_id: z.number().int(),
  date: z.date()
}).strict();
export const SiteMetricSite_idDateCompoundUniqueInputObjectSchema: z.ZodType<Prisma.SiteMetricSite_idDateCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.SiteMetricSite_idDateCompoundUniqueInput>;
export const SiteMetricSite_idDateCompoundUniqueInputObjectZodSchema = makeSchema();
