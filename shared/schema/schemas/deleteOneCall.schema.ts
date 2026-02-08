import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './objects/CallInclude.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';

export const CallDeleteOneSchema: z.ZodType<Prisma.CallDeleteArgs> = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), where: CallWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CallDeleteArgs>;

export const CallDeleteOneZodSchema = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), where: CallWhereUniqueInputObjectSchema }).strict();