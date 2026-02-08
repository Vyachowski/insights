import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './objects/CallImportSelect.schema';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './objects/CallImportInclude.schema';
import { CallImportUpdateInputObjectSchema as CallImportUpdateInputObjectSchema } from './objects/CallImportUpdateInput.schema';
import { CallImportUncheckedUpdateInputObjectSchema as CallImportUncheckedUpdateInputObjectSchema } from './objects/CallImportUncheckedUpdateInput.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './objects/CallImportWhereUniqueInput.schema';

export const CallImportUpdateOneSchema: z.ZodType<Prisma.CallImportUpdateArgs> = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), data: z.union([CallImportUpdateInputObjectSchema, CallImportUncheckedUpdateInputObjectSchema]), where: CallImportWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CallImportUpdateArgs>;

export const CallImportUpdateOneZodSchema = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), data: z.union([CallImportUpdateInputObjectSchema, CallImportUncheckedUpdateInputObjectSchema]), where: CallImportWhereUniqueInputObjectSchema }).strict();