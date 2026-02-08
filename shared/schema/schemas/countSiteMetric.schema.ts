import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricOrderByWithRelationInputObjectSchema as SiteMetricOrderByWithRelationInputObjectSchema } from './objects/SiteMetricOrderByWithRelationInput.schema';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './objects/SiteMetricWhereInput.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './objects/SiteMetricWhereUniqueInput.schema';
import { SiteMetricCountAggregateInputObjectSchema as SiteMetricCountAggregateInputObjectSchema } from './objects/SiteMetricCountAggregateInput.schema';

export const SiteMetricCountSchema: z.ZodType<Prisma.SiteMetricCountArgs> = z.object({ orderBy: z.union([SiteMetricOrderByWithRelationInputObjectSchema, SiteMetricOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteMetricWhereInputObjectSchema.optional(), cursor: SiteMetricWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SiteMetricCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricCountArgs>;

export const SiteMetricCountZodSchema = z.object({ orderBy: z.union([SiteMetricOrderByWithRelationInputObjectSchema, SiteMetricOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteMetricWhereInputObjectSchema.optional(), cursor: SiteMetricWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SiteMetricCountAggregateInputObjectSchema ]).optional() }).strict();