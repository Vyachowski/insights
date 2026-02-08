import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './objects/CallInclude.schema';
import { CallUpdateInputObjectSchema as CallUpdateInputObjectSchema } from './objects/CallUpdateInput.schema';
import { CallUncheckedUpdateInputObjectSchema as CallUncheckedUpdateInputObjectSchema } from './objects/CallUncheckedUpdateInput.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';

export const CallUpdateOneSchema: z.ZodType<Prisma.CallUpdateArgs> = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), data: z.union([CallUpdateInputObjectSchema, CallUncheckedUpdateInputObjectSchema]), where: CallWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CallUpdateArgs>;

export const CallUpdateOneZodSchema = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), data: z.union([CallUpdateInputObjectSchema, CallUncheckedUpdateInputObjectSchema]), where: CallWhereUniqueInputObjectSchema }).strict();