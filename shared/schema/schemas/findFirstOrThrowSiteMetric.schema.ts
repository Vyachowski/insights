import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { SiteMetricIncludeObjectSchema as SiteMetricIncludeObjectSchema } from './objects/SiteMetricInclude.schema';
import { SiteMetricOrderByWithRelationInputObjectSchema as SiteMetricOrderByWithRelationInputObjectSchema } from './objects/SiteMetricOrderByWithRelationInput.schema';
import { SiteMetricWhereInputObjectSchema as SiteMetricWhereInputObjectSchema } from './objects/SiteMetricWhereInput.schema';
import { SiteMetricWhereUniqueInputObjectSchema as SiteMetricWhereUniqueInputObjectSchema } from './objects/SiteMetricWhereUniqueInput.schema';
import { SiteMetricScalarFieldEnumSchema } from './enums/SiteMetricScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SiteMetricFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SiteMetricSelect> = z.object({
    id: z.boolean().optional(),
    site_id: z.boolean().optional(),
    date: z.boolean().optional(),
    yandex_users: z.boolean().optional(),
    google_users: z.boolean().optional(),
    other_users: z.boolean().optional(),
    visit_duration_yandex_in_sec: z.boolean().optional(),
    visit_duration_google_in_sec: z.boolean().optional(),
    visit_duration_other_in_sec: z.boolean().optional(),
    bounce_yandex: z.boolean().optional(),
    bounce_google: z.boolean().optional(),
    bounce_other: z.boolean().optional(),
    leads_yandex: z.boolean().optional(),
    leads_google: z.boolean().optional(),
    leads_other: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SiteMetricSelect>;

export const SiteMetricFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    site_id: z.boolean().optional(),
    date: z.boolean().optional(),
    yandex_users: z.boolean().optional(),
    google_users: z.boolean().optional(),
    other_users: z.boolean().optional(),
    visit_duration_yandex_in_sec: z.boolean().optional(),
    visit_duration_google_in_sec: z.boolean().optional(),
    visit_duration_other_in_sec: z.boolean().optional(),
    bounce_yandex: z.boolean().optional(),
    bounce_google: z.boolean().optional(),
    bounce_other: z.boolean().optional(),
    leads_yandex: z.boolean().optional(),
    leads_google: z.boolean().optional(),
    leads_other: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict();

export const SiteMetricFindFirstOrThrowSchema: z.ZodType<Prisma.SiteMetricFindFirstOrThrowArgs> = z.object({ select: SiteMetricFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SiteMetricIncludeObjectSchema.optional()), orderBy: z.union([SiteMetricOrderByWithRelationInputObjectSchema, SiteMetricOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteMetricWhereInputObjectSchema.optional(), cursor: SiteMetricWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SiteMetricScalarFieldEnumSchema, SiteMetricScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SiteMetricFindFirstOrThrowArgs>;

export const SiteMetricFindFirstOrThrowZodSchema = z.object({ select: SiteMetricFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SiteMetricIncludeObjectSchema.optional()), orderBy: z.union([SiteMetricOrderByWithRelationInputObjectSchema, SiteMetricOrderByWithRelationInputObjectSchema.array()]).optional(), where: SiteMetricWhereInputObjectSchema.optional(), cursor: SiteMetricWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SiteMetricScalarFieldEnumSchema, SiteMetricScalarFieldEnumSchema.array()]).optional() }).strict();