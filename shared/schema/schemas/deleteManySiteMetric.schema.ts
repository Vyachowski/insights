import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './objects/SiteMetricWhereInput.schema';

export const SiteMetricDeleteManySchema: z.ZodType<Prisma.SiteMetricDeleteManyArgs> = z.object({ where: SiteMetricWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricDeleteManyArgs>;

export const SiteMetricDeleteManyZodSchema = z.object({ where: SiteMetricWhereInputObjectSchema.optional() }).strict();