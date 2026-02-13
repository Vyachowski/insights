import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './objects/CallImportInclude.schema';
import { CallImportOrderByWithRelationInputObjectSchema as CallImportOrderByWithRelationInputObjectSchema } from './objects/CallImportOrderByWithRelationInput.schema';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './objects/CallImportWhereInput.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './objects/CallImportWhereUniqueInput.schema';
import { CallImportScalarFieldEnumSchema } from './enums/CallImportScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CallImportFindManySelectSchema: z.ZodType<Prisma.CallImportSelect> = z.object({
    id: z.boolean().optional(),
    siteId: z.boolean().optional(),
    date: z.boolean().optional(),
    src: z.boolean().optional(),
    region: z.boolean().optional(),
    callNumber: z.boolean().optional(),
    class: z.boolean().optional(),
    projectTitle: z.boolean().optional(),
    advChannelName: z.boolean().optional(),
    billsec: z.boolean().optional(),
    comment: z.boolean().optional(),
    redirectNumber: z.boolean().optional(),
    source: z.boolean().optional(),
    importedAt: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CallImportSelect>;

export const CallImportFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    siteId: z.boolean().optional(),
    date: z.boolean().optional(),
    src: z.boolean().optional(),
    region: z.boolean().optional(),
    callNumber: z.boolean().optional(),
    class: z.boolean().optional(),
    projectTitle: z.boolean().optional(),
    advChannelName: z.boolean().optional(),
    billsec: z.boolean().optional(),
    comment: z.boolean().optional(),
    redirectNumber: z.boolean().optional(),
    source: z.boolean().optional(),
    importedAt: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict();

export const CallImportFindManySchema: z.ZodType<Prisma.CallImportFindManyArgs> = z.object({ select: CallImportFindManySelectSchema.optional(), include: z.lazy(() => CallImportIncludeObjectSchema.optional()), orderBy: z.union([CallImportOrderByWithRelationInputObjectSchema, CallImportOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallImportWhereInputObjectSchema.optional(), cursor: CallImportWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CallImportScalarFieldEnumSchema, CallImportScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CallImportFindManyArgs>;

export const CallImportFindManyZodSchema = z.object({ select: CallImportFindManySelectSchema.optional(), include: z.lazy(() => CallImportIncludeObjectSchema.optional()), orderBy: z.union([CallImportOrderByWithRelationInputObjectSchema, CallImportOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallImportWhereInputObjectSchema.optional(), cursor: CallImportWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CallImportScalarFieldEnumSchema, CallImportScalarFieldEnumSchema.array()]).optional() }).strict();