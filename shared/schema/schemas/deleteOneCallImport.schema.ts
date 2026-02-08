import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './objects/CallImportSelect.schema';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './objects/CallImportInclude.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './objects/CallImportWhereUniqueInput.schema';

export const CallImportDeleteOneSchema: z.ZodType<Prisma.CallImportDeleteArgs> = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), where: CallImportWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CallImportDeleteArgs>;

export const CallImportDeleteOneZodSchema = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), where: CallImportWhereUniqueInputObjectSchema }).strict();