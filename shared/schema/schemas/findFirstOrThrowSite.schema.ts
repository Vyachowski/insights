import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteIncludeObjectSchema as SiteIncludeObjectSchema } from './objects/SiteInclude.schema';
import { SiteOrderByWithRelationInputObjectSchema as SiteOrderByWithRelationInputObjectSchema } from './objects/SiteOrderByWithRelationInput.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './objects/SiteWhereInput.schema';
import { SiteWhereUniqueInputObjectSchema as SiteWhereUniqueInputObjectSchema } from './objects/SiteWhereUniqueInput.schema';
import { SiteScalarFieldEnumSchema } from './enums/SiteScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SiteFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SiteSelect> = z.object({
    id: z.boolean().optional(),
    city_id: z.boolean().optional(),
    name: z.boolean().optional(),
    url: z.boolean().optional(),
    yandex_counter_id: z.boolean().optional(),
    google_counter_id: z.boolean().optional(),
    yandex_tag_manager_id: z.boolean().optional(),
    google_tag_manager_id: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    city: z.boolean().optional(),
    calls: z.boolean().optional(),
    callsRaw: z.boolean().optional(),
    metrics: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SiteSelect>;

export const SiteFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    city_id: z.boolean().optional(),
    name: z.boolean().optional(),
    url: z.boolean().optional(),
    yandex_counter_id: z.boolean().optional(),
    google_counter_id: z.boolean().optional(),
    yandex_tag_manager_id: z.boolean().optional(),
    google_tag_manager_id: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    city: z.boolean().optional(),
    calls: z.boolean().optional(),
    callsRaw: z.boolean().optional(),
    metrics: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const SiteFindFirstOrThrowSchema: z.ZodType<Prisma.SiteFindFirstOrThrowArgs> = z.object({ select: SiteFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SiteIncludeObjectSchema.optional()), orderBy: z.union([SiteOrderByWithRelationInputObjectSchema, SiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteWhereInputObjectSchema.optional(), cursor: SiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SiteScalarFieldEnumSchema, SiteScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SiteFindFirstOrThrowArgs>;

export const SiteFindFirstOrThrowZodSchema = z.object({ select: SiteFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SiteIncludeObjectSchema.optional()), orderBy: z.union([SiteOrderByWithRelationInputObjectSchema, SiteOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteWhereInputObjectSchema.optional(), cursor: SiteWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SiteScalarFieldEnumSchema, SiteScalarFieldEnumSchema.array()]).optional() }).strict();