import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './objects/CallImportSelect.schema';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './objects/CallImportInclude.schema';
import { CallImportCreateInputObjectSchema as CallImportCreateInputObjectSchema } from './objects/CallImportCreateInput.schema';
import { CallImportUncheckedCreateInputObjectSchema as CallImportUncheckedCreateInputObjectSchema } from './objects/CallImportUncheckedCreateInput.schema';

export const CallImportCreateOneSchema: z.ZodType<Prisma.CallImportCreateArgs> = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), data: z.union([CallImportCreateInputObjectSchema, CallImportUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CallImportCreateArgs>;

export const CallImportCreateOneZodSchema = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), data: z.union([CallImportCreateInputObjectSchema, CallImportUncheckedCreateInputObjectSchema]) }).strict();