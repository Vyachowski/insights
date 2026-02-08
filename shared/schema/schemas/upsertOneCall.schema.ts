import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './objects/CallInclude.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';
import { CallCreateInputObjectSchema as CallCreateInputObjectSchema } from './objects/CallCreateInput.schema';
import { CallUncheckedCreateInputObjectSchema as CallUncheckedCreateInputObjectSchema } from './objects/CallUncheckedCreateInput.schema';
import { CallUpdateInputObjectSchema as CallUpdateInputObjectSchema } from './objects/CallUpdateInput.schema';
import { CallUncheckedUpdateInputObjectSchema as CallUncheckedUpdateInputObjectSchema } from './objects/CallUncheckedUpdateInput.schema';

export const CallUpsertOneSchema: z.ZodType<Prisma.CallUpsertArgs> = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), where: CallWhereUniqueInputObjectSchema, create: z.union([ CallCreateInputObjectSchema, CallUncheckedCreateInputObjectSchema ]), update: z.union([ CallUpdateInputObjectSchema, CallUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CallUpsertArgs>;

export const CallUpsertOneZodSchema = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), where: CallWhereUniqueInputObjectSchema, create: z.union([ CallCreateInputObjectSchema, CallUncheckedCreateInputObjectSchema ]), update: z.union([ CallUpdateInputObjectSchema, CallUncheckedUpdateInputObjectSchema ]) }).strict();