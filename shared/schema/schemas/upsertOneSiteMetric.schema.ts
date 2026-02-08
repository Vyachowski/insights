import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './objects/SiteMetricSelect.schema';
import { SiteMetricIncludeObjectSchema as SiteMetricIncludeObjectSchema } from './objects/SiteMetricInclude.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './objects/SiteMetricWhereUniqueInput.schema';
import { SiteMetricCreateInputObjectSchema as SiteMetricCreateInputObjectSchema } from './objects/SiteMetricCreateInput.schema';
import { SiteMetricUncheckedCreateInputObjectSchema as SiteMetricUncheckedCreateInputObjectSchema } from './objects/SiteMetricUncheckedCreateInput.schema';
import { SiteMetricUpdateInputObjectSchema as SiteMetricUpdateInputObjectSchema } from './objects/SiteMetricUpdateInput.schema';
import { SiteMetricUncheckedUpdateInputObjectSchema as SiteMetricUncheckedUpdateInputObjectSchema } from './objects/SiteMetricUncheckedUpdateInput.schema';

export const SiteMetricUpsertOneSchema: z.ZodType<Prisma.SiteMetricUpsertArgs> = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), where: SiteMetricWhereUniqueInputObjectSchema, create: z.union([ SiteMetricCreateInputObjectSchema, SiteMetricUncheckedCreateInputObjectSchema ]), update: z.union([ SiteMetricUpdateInputObjectSchema, SiteMetricUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SiteMetricUpsertArgs>;

export const SiteMetricUpsertOneZodSchema = z.object({ select: SiteMetricSelectObjectSchema.optional(), include: SiteMetricIncludeObjectSchema.optional(), where: SiteMetricWhereUniqueInputObjectSchema, create: z.union([ SiteMetricCreateInputObjectSchema, SiteMetricUncheckedCreateInputObjectSchema ]), update: z.union([ SiteMetricUpdateInputObjectSchema, SiteMetricUncheckedUpdateInputObjectSchema ]) }).strict();