import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteOrderByWithRelationInputObjectSchema as SiteOrderByWithRelationInputObjectSchema } from './objects/SiteOrderByWithRelationInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';
import { SiteCountAggregateInputObjectSchema as SiteCountAggregateInputObjectSchema } from './objects/SiteCountAggregateInput.schema';

export const SiteCountSchema: z.ZodType<Prisma.SiteCountArgs> = z.object({ orderBy: z.union([SiteOrderByWithRelationInputObjectSchema, SiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteWhereInputObjectSchema.optional(), cursor: SiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SiteCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SiteCountArgs>;

export const SiteCountZodSchema = z.object({ orderBy: z.union([SiteOrderByWithRelationInputObjectSchema, SiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteWhereInputObjectSchema.optional(), cursor: SiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SiteCountAggregateInputObjectSchema ]).optional() }).strict();