import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './objects/CallInclude.schema';
import { CallOrderByWithRelationInputObjectSchema as CallOrderByWithRelationInputObjectSchema } from './objects/CallOrderByWithRelationInput.schema';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';
import { CallScalarFieldEnumSchema } from './enums/CallScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const CallFindFirstOrThrowSelectSchema: z.ZodType<Prisma.CallSelect> = z.object({
    id: z.boolean().optional(),
    siteId: z.boolean().optional(),
    gudokId: z.boolean().optional(),
    projectId: z.boolean().optional(),
    projectTitle: z.boolean().optional(),
    dst: z.boolean().optional(),
    advChannelId: z.boolean().optional(),
    advChannelName: z.boolean().optional(),
    src: z.boolean().optional(),
    duration: z.boolean().optional(),
    billsec: z.boolean().optional(),
    callstatus: z.boolean().optional(),
    date: z.boolean().optional(),
    region: z.boolean().optional(),
    callNumber: z.boolean().optional(),
    audio: z.boolean().optional(),
    source: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.CallSelect>;

export const CallFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    siteId: z.boolean().optional(),
    gudokId: z.boolean().optional(),
    projectId: z.boolean().optional(),
    projectTitle: z.boolean().optional(),
    dst: z.boolean().optional(),
    advChannelId: z.boolean().optional(),
    advChannelName: z.boolean().optional(),
    src: z.boolean().optional(),
    duration: z.boolean().optional(),
    billsec: z.boolean().optional(),
    callstatus: z.boolean().optional(),
    date: z.boolean().optional(),
    region: z.boolean().optional(),
    callNumber: z.boolean().optional(),
    audio: z.boolean().optional(),
    source: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    site: z.boolean().optional()
  }).strict();

export const CallFindFirstOrThrowSchema: z.ZodType<Prisma.CallFindFirstOrThrowArgs> = z.object({ select: CallFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CallIncludeObjectSchema.optional()), orderBy: z.union([CallOrderByWithRelationInputObjectSchema, CallOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallWhereInputObjectSchema.optional(), cursor: CallWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CallScalarFieldEnumSchema, CallScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.CallFindFirstOrThrowArgs>;

export const CallFindFirstOrThrowZodSchema = z.object({ select: CallFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => CallIncludeObjectSchema.optional()), orderBy: z.union([CallOrderByWithRelationInputObjectSchema, CallOrderByWithRelationInputObjectSchema.array()]).optional(), where: CallWhereInputObjectSchema.optional(), cursor: CallWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([CallScalarFieldEnumSchema, CallScalarFieldEnumSchema.array()]).optional() }).strict();