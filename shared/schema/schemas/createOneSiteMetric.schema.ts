import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './objects/SiteMetricSelect.schema';
import { SiteMetricIncludeObjectSchema as SiteMetricIncludeObjectSchema } from './objects/SiteMetricInclude.schema';
import { SiteMetricCreateInputObjectSchema as SiteMetricCreateInputObjectSchema } from './objects/SiteMetricCreateInput.schema';
import { SiteMetricUncheckedCreateInputObjectSchema as SiteMetricUncheckedCreateInputObjectSchema } from './objects/SiteMetricUncheckedCreateInput.schema';

export const SiteMetricCreateOneSchema: z.ZodType<Prisma.SiteMetricCreateArgs> = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), data: z.union([SiteMetricCreateInputObjectSchema, SiteMetricUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SiteMetricCreateArgs>;

export const SiteMetricCreateOneZodSchema = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), data: z.union([SiteMetricCreateInputObjectSchema, SiteMetricUncheckedCreateInputObjectSchema]) }).strict();