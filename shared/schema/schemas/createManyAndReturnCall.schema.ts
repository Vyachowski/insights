import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallSelectObjectSchema as CallSelectObjectSchema } from './objects/CallSelect.schema';
import { CallCreateManyInputObjectSchema as CallCreateManyInputObjectSchema } from './objects/CallCreateManyInput.schema';

export const CallCreateManyAndReturnSchema: z.ZodType<Prisma.CallCreateManyAndReturnArgs> = z.object({ select: CallSelectObjectSchema.optional(), data: z.union([ CallCreateManyInputObjectSchema, z.array(CallCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CallCreateManyAndReturnArgs>;

export const CallCreateManyAndReturnZodSchema = z.object({ select: CallSelectObjectSchema.optional(), data: z.union([ CallCreateManyInputObjectSchema, z.array(CallCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();