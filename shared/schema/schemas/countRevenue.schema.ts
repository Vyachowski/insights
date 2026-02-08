import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueOrderByWithRelationInputObjectSchema as RevenueOrderByWithRelationInputObjectSchema } from './objects/RevenueOrderByWithRelationInput.schema';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './objects/RevenueWhereInput.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './objects/RevenueWhereUniqueInput.schema';
import { RevenueCountAggregateInputObjectSchema as RevenueCountAggregateInputObjectSchema } from './objects/RevenueCountAggregateInput.schema';

export const RevenueCountSchema: z.ZodType<Prisma.RevenueCountArgs> = z.object({ orderBy: z.union([RevenueOrderByWithRelationInputObjectSchema, RevenueOrderByWithRelationInputObjectSchema.array()]).optional(), where: RevenueWhereInputObjectSchema.optional(), cursor: RevenueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RevenueCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.RevenueCountArgs>;

export const RevenueCountZodSchema = z.object({ orderBy: z.union([RevenueOrderByWithRelationInputObjectSchema, RevenueOrderByWithRelationInputObjectSchema.array()]).optional(), where: RevenueWhereInputObjectSchema.optional(), cursor: RevenueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), RevenueCountAggregateInputObjectSchema ]).optional() }).strict();