import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './objects/SiteMetricSelect.schema';
import { SiteMetricIncludeObjectSchema as SiteMetricIncludeObjectSchema } from './objects/SiteMetricInclude.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './objects/SiteMetricWhereUniqueInput.schema';

export const SiteMetricFindUniqueOrThrowSchema: z.ZodType<Prisma.SiteMetricFindUniqueOrThrowArgs> = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), where: SiteMetricWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SiteMetricFindUniqueOrThrowArgs>;

export const SiteMetricFindUniqueOrThrowZodSchema = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), where: SiteMetricWhereUniqueInputObjectSchema }).strict();