import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './objects/CallImportInclude.schema';
import { CallImportOrderByWithRelationInputObjectSchema as CallImportOrderByWithRelationInputObjectSchema } from './objects/CallImportOrderByWithRelationInput.schema';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './objects/CallImportWhereInput.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './objects/CallImportWhereUniqueInput.schema';
import { CallImportScalarFieldEnumSchema } from './enums/CallImportScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CallImportFindFirstOrThrowSelectSchema: z.ZodType<Prisma.CallImportSelect> = z.object({
    id: z.boolean().optional(),
    site_id: z.boolean().optional(),
    date: z.boolean().optional(),
    src: z.boolean().optional(),
    region: z.boolean().optional(),
    call_number: z.boolean().optional(),
    class: z.boolean().optional(),
    project_title: z.boolean().optional(),
    adv_channel_name: z.boolean().optional(),
    billsec: z.boolean().optional(),
    comment: z.boolean().optional(),
    redirect_number: z.boolean().optional(),
    source: z.boolean().optional(),
    imported_at: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CallImportSelect>;

export const CallImportFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    site_id: z.boolean().optional(),
    date: z.boolean().optional(),
    src: z.boolean().optional(),
    region: z.boolean().optional(),
    call_number: z.boolean().optional(),
    class: z.boolean().optional(),
    project_title: z.boolean().optional(),
    adv_channel_name: z.boolean().optional(),
    billsec: z.boolean().optional(),
    comment: z.boolean().optional(),
    redirect_number: z.boolean().optional(),
    source: z.boolean().optional(),
    imported_at: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict();

export const CallImportFindFirstOrThrowSchema: z.ZodType<Prisma.CallImportFindFirstOrThrowArgs> = z.object({ select: CallImportFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CallImportIncludeObjectSchema.optional()), orderBy: z.union([CallImportOrderByWithRelationInputObjectSchema, CallImportOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallImportWhereInputObjectSchema.optional(), cursor: CallImportWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CallImportScalarFieldEnumSchema, CallImportScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CallImportFindFirstOrThrowArgs>;

export const CallImportFindFirstOrThrowZodSchema = z.object({ select: CallImportFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CallImportIncludeObjectSchema.optional()), orderBy: z.union([CallImportOrderByWithRelationInputObjectSchema, CallImportOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallImportWhereInputObjectSchema.optional(), cursor: CallImportWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CallImportScalarFieldEnumSchema, CallImportScalarFieldEnumSchema.array()]).optional() }).strict();