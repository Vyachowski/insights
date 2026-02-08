import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallUpdateManyMutationInputObjectSchema as CallUpdateManyMutationInputObjectSchema } from './objects/CallUpdateManyMutationInput.schema';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';

export const CallUpdateManySchema: z.ZodType<Prisma.CallUpdateManyArgs> = z.object({ data: CallUpdateManyMutationInputObjectSchema, where: CallWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallUpdateManyArgs>;

export const CallUpdateManyZodSchema = z.object({ data: CallUpdateManyMutationInputObjectSchema, where: CallWhereInputObjectSchema.optional() }).strict();