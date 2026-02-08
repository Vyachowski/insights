import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricSelectObjectSchema as SiteMetricSelectObjectSchema } from './objects/SiteMetricSelect.schema';
import { SiteMetricCreateManyInputObjectSchema as SiteMetricCreateManyInputObjectSchema } from './objects/SiteMetricCreateManyInput.schema';

export const SiteMetricCreateManyAndReturnSchema: z.ZodType<Prisma.SiteMetricCreateManyAndReturnArgs> = z.object({ select: SiteMetricSelectObjectSchema.optional(), data: z.union([ SiteMetricCreateManyInputObjectSchema, z.array(SiteMetricCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricCreateManyAndReturnArgs>;

export const SiteMetricCreateManyAndReturnZodSchema = z.object({ select: SiteMetricSelectObjectSchema.optional(), data: z.union([ SiteMetricCreateManyInputObjectSchema, z.array(SiteMetricCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();