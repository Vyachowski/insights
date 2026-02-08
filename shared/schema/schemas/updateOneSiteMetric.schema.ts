import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './objects/SiteMetricSelect.schema';
import { SiteMetricIncludeObjectSchema as SiteMetricIncludeObjectSchema } from './objects/SiteMetricInclude.schema';
import { SiteMetricUpdateInputObjectSchema as SiteMetricUpdateInputObjectSchema } from './objects/SiteMetricUpdateInput.schema';
import { SiteMetricUncheckedUpdateInputObjectSchema as SiteMetricUncheckedUpdateInputObjectSchema } from './objects/SiteMetricUncheckedUpdateInput.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './objects/SiteMetricWhereUniqueInput.schema';

export const SiteMetricUpdateOneSchema: z.ZodType<Prisma.SiteMetricUpdateArgs> = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), data: z.union([SiteMetricUpdateInputObjectSchema, SiteMetricUncheckedUpdateInputObjectSchema]), where: SiteMetricWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SiteMetricUpdateArgs>;

export const SiteMetricUpdateOneZodSchema = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), data: z.union([SiteMetricUpdateInputObjectSchema, SiteMetricUncheckedUpdateInputObjectSchema]), where: SiteMetricWhereUniqueInputObjectSchema }).strict();