import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { RevenueIncludeObjectSchema as RevenueIncludeObjectSchema } from './objects/RevenueInclude.schema';
import { RevenueOrderByWithRelationInputObjectSchema as RevenueOrderByWithRelationInputObjectSchema } from './objects/RevenueOrderByWithRelationInput.schema';
import { RevenueWhereInputObjectSchema as RevenueWhereInputObjectSchema } from './objects/RevenueWhereInput.schema';
import { RevenueWhereUniqueInputObjectSchema as RevenueWhereUniqueInputObjectSchema } from './objects/RevenueWhereUniqueInput.schema';
import { RevenueScalarFieldEnumSchema } from './enums/RevenueScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const RevenueFindManySelectSchema: z.ZodType<Prisma.RevenueSelect> = z.object({
    id: z.boolean().optional(),
    city_id: z.boolean().optional(),
    date: z.boolean().optional(),
    amount: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    city: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.RevenueSelect>;

export const RevenueFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    city_id: z.boolean().optional(),
    date: z.boolean().optional(),
    amount: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    city: z.boolean().optional()
  }).strict();

export const RevenueFindManySchema: z.ZodType<Prisma.RevenueFindManyArgs> = z.object({ select: RevenueFindManySelectSchema.optional(), include: z.lazy(() => RevenueIncludeObjectSchema.optional()), orderBy: z.union([RevenueOrderByWithRelationInputObjectSchema, RevenueOrderByWithRelationInputObjectSchema.array()]).optional(), where: RevenueWhereInputObjectSchema.optional(), cursor: RevenueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RevenueScalarFieldEnumSchema, RevenueScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.RevenueFindManyArgs>;

export const RevenueFindManyZodSchema = z.object({ select: RevenueFindManySelectSchema.optional(), include: z.lazy(() => RevenueIncludeObjectSchema.optional()), orderBy: z.union([RevenueOrderByWithRelationInputObjectSchema, RevenueOrderByWithRelationInputObjectSchema.array()]).optional(), where: RevenueWhereInputObjectSchema.optional(), cursor: RevenueWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([RevenueScalarFieldEnumSchema, RevenueScalarFieldEnumSchema.array()]).optional() }).strict();