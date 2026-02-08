import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './objects/CityInclude.schema';
import { CityOrderByWithRelationInputObjectSchema as CityOrderByWithRelationInputObjectSchema } from './objects/CityOrderByWithRelationInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';
import { CityScalarFieldEnumSchema } from './enums/CityScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CityFindFirstOrThrowSelectSchema: z.ZodType<Prisma.CitySelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    slug: z.boolean().optional(),
    name: z.boolean().optional(),
    population: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sites: z.boolean().optional(),
    revenues: z.boolean().optional(),
    expenses: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CitySelect>;

export const CityFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    slug: z.boolean().optional(),
    name: z.boolean().optional(),
    population: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    sites: z.boolean().optional(),
    revenues: z.boolean().optional(),
    expenses: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const CityFindFirstOrThrowSchema: z.ZodType<Prisma.CityFindFirstOrThrowArgs> = z.object({ select: CityFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CityIncludeObjectSchema.optional()), orderBy: z.union([CityOrderByWithRelationInputObjectSchema, CityOrderByWithRelationInputObjectSchema.array()]).optional(), where: CityWhereInputObjectSchema.optional(), cursor: CityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CityScalarFieldEnumSchema, CityScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CityFindFirstOrThrowArgs>;

export const CityFindFirstOrThrowZodSchema = z.object({ select: CityFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CityIncludeObjectSchema.optional()), orderBy: z.union([CityOrderByWithRelationInputObjectSchema, CityOrderByWithRelationInputObjectSchema.array()]).optional(), where: CityWhereInputObjectSchema.optional(), cursor: CityWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CityScalarFieldEnumSchema, CityScalarFieldEnumSchema.array()]).optional() }).strict();