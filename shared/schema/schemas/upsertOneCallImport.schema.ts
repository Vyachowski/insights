import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './objects/CallImportSelect.schema';
import { CallImportIncludeObjectSchema as CallImportIncludeObjectSchema } from './objects/CallImportInclude.schema';
import { CallImportWhereUniqueInputObjectSchema as CallImportWhereUniqueInputObjectSchema } from './objects/CallImportWhereUniqueInput.schema';
import { CallImportCreateInputObjectSchema as CallImportCreateInputObjectSchema } from './objects/CallImportCreateInput.schema';
import { CallImportUncheckedCreateInputObjectSchema as CallImportUncheckedCreateInputObjectSchema } from './objects/CallImportUncheckedCreateInput.schema';
import { CallImportUpdateInputObjectSchema as CallImportUpdateInputObjectSchema } from './objects/CallImportUpdateInput.schema';
import { CallImportUncheckedUpdateInputObjectSchema as CallImportUncheckedUpdateInputObjectSchema } from './objects/CallImportUncheckedUpdateInput.schema';

export const CallImportUpsertOneSchema: z.ZodType<Prisma.CallImportUpsertArgs> = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), where: CallImportWhereUniqueInputObjectSchema, create: z.union([ CallImportCreateInputObjectSchema, CallImportUncheckedCreateInputObjectSchema ]), update: z.union([ CallImportUpdateInputObjectSchema, CallImportUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CallImportUpsertArgs>;

export const CallImportUpsertOneZodSchema = z.object({ select: CallImportSelectObjectSchema.optional(), include: CallImportIncludeObjectSchema.optional(), where: CallImportWhereUniqueInputObjectSchema, create: z.union([ CallImportCreateInputObjectSchema, CallImportUncheckedCreateInputObjectSchema ]), update: z.union([ CallImportUpdateInputObjectSchema, CallImportUncheckedUpdateInputObjectSchema ]) }).strict();