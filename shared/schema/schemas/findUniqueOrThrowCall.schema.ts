import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallIncludeObjectSchema as CallIncludeObjectSchema } from './objects/CallInclude.schema';
import { CallWhereUniqueInputObjectSchema as CallWhereUniqueInputObjectSchema } from './objects/CallWhereUniqueInput.schema';

export const CallFindUniqueOrThrowSchema: z.ZodType<Prisma.CallFindUniqueOrThrowArgs> = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), where: CallWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CallFindUniqueOrThrowArgs>;

export const CallFindUniqueOrThrowZodSchema = z.object({ select: CallSelectObjectSchema.optional(), include: CallIncludeObjectSchema.optional(), where: CallWhereUniqueInputObjectSchema }).strict();