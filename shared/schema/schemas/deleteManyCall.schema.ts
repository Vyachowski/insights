import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';

export const CallDeleteManySchema: z.ZodType<Prisma.CallDeleteManyArgs> = z.object({ where: CallWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallDeleteManyArgs>;

export const CallDeleteManyZodSchema = z.object({ where: CallWhereInputObjectSchema.optional() }).strict();