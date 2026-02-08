import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './objects/CallInclude.schema';
import { CallCreateInputObjectSchema as CallCreateInputObjectSchema } from './objects/CallCreateInput.schema';
import { CallUncheckedCreateInputObjectSchema as CallUncheckedCreateInputObjectSchema } from './objects/CallUncheckedCreateInput.schema';

export const CallCreateOneSchema: z.ZodType<Prisma.CallCreateArgs> = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), data: z.union([CallCreateInputObjectSchema, CallUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CallCreateArgs>;

export const CallCreateOneZodSchema = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), data: z.union([CallCreateInputObjectSchema, CallUncheckedCreateInputObjectSchema]) }).strict();