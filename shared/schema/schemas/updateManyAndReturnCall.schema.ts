import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallUpdateManyMutationInputObjectSchema as CallUpdateManyMutationInputObjectSchema } from './objects/CallUpdateManyMutationInput.schema';
import { CallWhereInputObjectSchema as CallWhereInputObjectSchema } from './objects/CallWhereInput.schema';

export const CallUpdateManyAndReturnSchema: z.ZodType<Prisma.CallUpdateManyAndReturnArgs> = z.object({ select: CallSelectObjectSchema.optional(), data: CallUpdateManyMutationInputObjectSchema, where: CallWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallUpdateManyAndReturnArgs>;

export const CallUpdateManyAndReturnZodSchema = z.object({ select: CallSelectObjectSchema.optional(), data: CallUpdateManyMutationInputObjectSchema, where: CallWhereInputObjectSchema.optional() }).strict();