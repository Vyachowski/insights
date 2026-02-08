import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricCreateManyInputObjectSchema as SiteMetricCreateManyInputObjectSchema } from './objects/SiteMetricCreateManyInput.schema';

export const SiteMetricCreateManySchema: z.ZodType<Prisma.SiteMetricCreateManyArgs> = z.object({ data: z.union([ SiteMetricCreateManyInputObjectSchema, z.array(SiteMetricCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricCreateManyArgs>;

export const SiteMetricCreateManyZodSchema = z.object({ data: z.union([ SiteMetricCreateManyInputObjectSchema, z.array(SiteMetricCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();