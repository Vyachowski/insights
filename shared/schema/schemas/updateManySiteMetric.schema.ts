import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricUpdateManyMutationInputObjectSchema as SiteMetricUpdateManyMutationInputObjectSchema } from './objects/SiteMetricUpdateManyMutationInput.schema';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './objects/SiteMetricWhereInput.schema';

export const SiteMetricUpdateManySchema: z.ZodType<Prisma.SiteMetricUpdateManyArgs> = z.object({ data: SiteMetricUpdateManyMutationInputObjectSchema, where: SiteMetricWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricUpdateManyArgs>;

export const SiteMetricUpdateManyZodSchema = z.object({ data: SiteMetricUpdateManyMutationInputObjectSchema, where: SiteMetricWhereInputObjectSchema.optional() }).strict();