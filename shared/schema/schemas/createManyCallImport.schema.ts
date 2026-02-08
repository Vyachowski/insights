import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportCreateManyInputObjectSchema as CallImportCreateManyInputObjectSchema } from './objects/CallImportCreateManyInput.schema';

export const CallImportCreateManySchema: z.ZodType<Prisma.CallImportCreateManyArgs> = z.object({ data: z.union([ CallImportCreateManyInputObjectSchema, z.array(CallImportCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CallImportCreateManyArgs>;

export const CallImportCreateManyZodSchema = z.object({ data: z.union([ CallImportCreateManyInputObjectSchema, z.array(CallImportCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();