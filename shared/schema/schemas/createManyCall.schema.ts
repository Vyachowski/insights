import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallCreateManyInputObjectSchema as CallCreateManyInputObjectSchema } from './objects/CallCreateManyInput.schema';

export const CallCreateManySchema: z.ZodType<Prisma.CallCreateManyArgs> = z.object({ data: z.union([ CallCreateManyInputObjectSchema, z.array(CallCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CallCreateManyArgs>;

export const CallCreateManyZodSchema = z.object({ data: z.union([ CallCreateManyInputObjectSchema, z.array(CallCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();