import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';
import { SiteOrderByWithAggregationInputObjectSchema as SiteOrderByWithAggregationInputObjectSchema } from './objects/SiteOrderByWithAggregationInput.schema';
import { SiteScalarWhereWithAggregatesInputObjectSchema as SiteScalarWhereWithAggregatesInputObjectSchema } from './objects/SiteScalarWhereWithAggregatesInput.schema';
import { SiteScalarFieldEnumSchema } from './enums/SiteScalarFieldEnum.schema';
import { SiteCountAggregateInputObjectSchema as SiteCountAggregateInputObjectSchema } from './objects/SiteCountAggregateInput.schema';
import { SiteMinAggregateInputObjectSchema as SiteMinAggregateInputObjectSchema } from './objects/SiteMinAggregateInput.schema';
import { SiteMaxAggregateInputObjectSchema as SiteMaxAggregateInputObjectSchema } from './objects/SiteMaxAggregateInput.schema';
import { SiteAvgAggregateInputObjectSchema as SiteAvgAggregateInputObjectSchema } from './objects/SiteAvgAggregateInput.schema';
import { SiteSumAggregateInputObjectSchema as SiteSumAggregateInputObjectSchema } from './objects/SiteSumAggregateInput.schema';

export const SiteGroupBySchema: z.ZodType<Prisma.SiteGroupByArgs> = z.object({ where: SiteWhereInputObjectSchema.optional(), orderBy: z.union([SiteOrderByWithAggregationInputObjectSchema, SiteOrderByWithAggregationInputObjectSchema.array()]).optional(), having: SiteScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(SiteScalarFieldEnumSchema), _count: z.union([ z.literal(true), SiteCountAggregateInputObjectSchema ]).optional(), _min: SiteMinAggregateInputObjectSchema.optional(), _max: SiteMaxAggregateInputObjectSchema.optional(), _avg: SiteAvgAggregateInputObjectSchema.optional(), _sum: SiteSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SiteGroupByArgs>;

export const SiteGroupByZodSchema = z.object({ where: SiteWhereInputObjectSchema.optional(), orderBy: z.union([SiteOrderByWithAggregationInputObjectSchema, SiteOrderByWithAggregationInputObjectSchema.array()]).optional(), having: SiteScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(SiteScalarFieldEnumSchema), _count: z.union([ z.literal(true), SiteCountAggregateInputObjectSchema ]).optional(), _min: SiteMinAggregateInputObjectSchema.optional(), _max: SiteMaxAggregateInputObjectSchema.optional(), _avg: SiteAvgAggregateInputObjectSchema.optional(), _sum: SiteSumAggregateInputObjectSchema.optional() }).strict();