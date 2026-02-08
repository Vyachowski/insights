import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteOrderByWithRelationInputObjectSchema as SiteOrderByWithRelationInputObjectSchema } from './objects/SiteOrderByWithRelationInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';
import { SiteCountAggregateInputObjectSchema as SiteCountAggregateInputObjectSchema } from './objects/SiteCountAggregateInput.schema';
import { SiteMinAggregateInputObjectSchema as SiteMinAggregateInputObjectSchema } from './objects/SiteMinAggregateInput.schema';
import { SiteMaxAggregateInputObjectSchema as SiteMaxAggregateInputObjectSchema } from './objects/SiteMaxAggregateInput.schema';
import { SiteAvgAggregateInputObjectSchema as SiteAvgAggregateInputObjectSchema } from './objects/SiteAvgAggregateInput.schema';
import { SiteSumAggregateInputObjectSchema as SiteSumAggregateInputObjectSchema } from './objects/SiteSumAggregateInput.schema';

export const SiteAggregateSchema: z.ZodType<Prisma.SiteAggregateArgs> = z.object({ orderBy: z.union([SiteOrderByWithRelationInputObjectSchema, SiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteWhereInputObjectSchema.optional(), cursor: SiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), SiteCountAggregateInputObjectSchema ]).optional(), _min: SiteMinAggregateInputObjectSchema.optional(), _max: SiteMaxAggregateInputObjectSchema.optional(), _avg: SiteAvgAggregateInputObjectSchema.optional(), _sum: SiteSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteAggregateArgs>;

export const SiteAggregateZodSchema = z.object({ orderBy: z.union([SiteOrderByWithRelationInputObjectSchema, SiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteWhereInputObjectSchema.optional(), cursor: SiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), SiteCountAggregateInputObjectSchema ]).optional(), _min: SiteMinAggregateInputObjectSchema.optional(), _max: SiteMaxAggregateInputObjectSchema.optional(), _avg: SiteAvgAggregateInputObjectSchema.optional(), _sum: SiteSumAggregateInputObjectSchema.optional() }).strict();