import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityOrderByWithRelationInputObjectSchema as CityOrderByWithRelationInputObjectSchema } from './objects/CityOrderByWithRelationInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';
import { CityCountAggregateInputObjectSchema as CityCountAggregateInputObjectSchema } from './objects/CityCountAggregateInput.schema';

export const CityCountSchema: z.ZodType<Prisma.CityCountArgs> = z.object({ orderBy: z.union([CityOrderByWithRelationInputObjectSchema, CityOrderByWithRelationInputObjectSchema.array()]).optional(), where: CityWhereInputObjectSchema.optional(), cursor: CityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CityCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CityCountArgs>;

export const CityCountZodSchema = z.object({ orderBy: z.union([CityOrderByWithRelationInputObjectSchema, CityOrderByWithRelationInputObjectSchema.array()]).optional(), where: CityWhereInputObjectSchema.optional(), cursor: CityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CityCountAggregateInputObjectSchema ]).optional() }).strict();