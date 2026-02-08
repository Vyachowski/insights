import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityOrderByWithRelationInputObjectSchema as CityOrderByWithRelationInputObjectSchema } from './objects/CityOrderByWithRelationInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';
import { CityCountAggregateInputObjectSchema as CityCountAggregateInputObjectSchema } from './objects/CityCountAggregateInput.schema';
import { CityMinAggregateInputObjectSchema as CityMinAggregateInputObjectSchema } from './objects/CityMinAggregateInput.schema';
import { CityMaxAggregateInputObjectSchema as CityMaxAggregateInputObjectSchema } from './objects/CityMaxAggregateInput.schema';
import { CityAvgAggregateInputObjectSchema as CityAvgAggregateInputObjectSchema } from './objects/CityAvgAggregateInput.schema';
import { CitySumAggregateInputObjectSchema as CitySumAggregateInputObjectSchema } from './objects/CitySumAggregateInput.schema';

export const CityAggregateSchema: z.ZodType<Prisma.CityAggregateArgs> = z.object({ orderBy: z.union([CityOrderByWithRelationInputObjectSchema, CityOrderByWithRelationInputObjectSchema.array()]).optional(), where: CityWhereInputObjectSchema.optional(), cursor: CityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CityCountAggregateInputObjectSchema ]).optional(), _min: CityMinAggregateInputObjectSchema.optional(), _max: CityMaxAggregateInputObjectSchema.optional(), _avg: CityAvgAggregateInputObjectSchema.optional(), _sum: CitySumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CityAggregateArgs>;

export const CityAggregateZodSchema = z.object({ orderBy: z.union([CityOrderByWithRelationInputObjectSchema, CityOrderByWithRelationInputObjectSchema.array()]).optional(), where: CityWhereInputObjectSchema.optional(), cursor: CityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CityCountAggregateInputObjectSchema ]).optional(), _min: CityMinAggregateInputObjectSchema.optional(), _max: CityMaxAggregateInputObjectSchema.optional(), _avg: CityAvgAggregateInputObjectSchema.optional(), _sum: CitySumAggregateInputObjectSchema.optional() }).strict();