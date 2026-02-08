import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';
import { CityOrderByWithAggregationInputObjectSchema as CityOrderByWithAggregationInputObjectSchema } from './objects/CityOrderByWithAggregationInput.schema';
import { CityScalarWhereWithAggregatesInputObjectSchema as CityScalarWhereWithAggregatesInputObjectSchema } from './objects/CityScalarWhereWithAggregatesInput.schema';
import { CityScalarFieldEnumSchema } from './enums/CityScalarFieldEnum.schema';
import { CityCountAggregateInputObjectSchema as CityCountAggregateInputObjectSchema } from './objects/CityCountAggregateInput.schema';
import { CityMinAggregateInputObjectSchema as CityMinAggregateInputObjectSchema } from './objects/CityMinAggregateInput.schema';
import { CityMaxAggregateInputObjectSchema as CityMaxAggregateInputObjectSchema } from './objects/CityMaxAggregateInput.schema';
import { CityAvgAggregateInputObjectSchema as CityAvgAggregateInputObjectSchema } from './objects/CityAvgAggregateInput.schema';
import { CitySumAggregateInputObjectSchema as CitySumAggregateInputObjectSchema } from './objects/CitySumAggregateInput.schema';

export const CityGroupBySchema: z.ZodType<Prisma.CityGroupByArgs> = z.object({ where: CityWhereInputObjectSchema.optional(), orderBy: z.union([CityOrderByWithAggregationInputObjectSchema, CityOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CityScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CityScalarFieldEnumSchema), _count: z.union([ z.literal(true), CityCountAggregateInputObjectSchema ]).optional(), _min: CityMinAggregateInputObjectSchema.optional(), _max: CityMaxAggregateInputObjectSchema.optional(), _avg: CityAvgAggregateInputObjectSchema.optional(), _sum: CitySumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CityGroupByArgs>;

export const CityGroupByZodSchema = z.object({ where: CityWhereInputObjectSchema.optional(), orderBy: z.union([CityOrderByWithAggregationInputObjectSchema, CityOrderByWithAggregationInputObjectSchema.array()]).optional(), having: CityScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(CityScalarFieldEnumSchema), _count: z.union([ z.literal(true), CityCountAggregateInputObjectSchema ]).optional(), _min: CityMinAggregateInputObjectSchema.optional(), _max: CityMaxAggregateInputObjectSchema.optional(), _avg: CityAvgAggregateInputObjectSchema.optional(), _sum: CitySumAggregateInputObjectSchema.optional() }).strict();