import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './objects/CallImportSelect.schema';
import { CallImportCreateManyInputObjectSchema as CallImportCreateManyInputObjectSchema } from './objects/CallImportCreateManyInput.schema';

export const CallImportCreateManyAndReturnSchema: z.ZodType<Prisma.CallImportCreateManyAndReturnArgs> = z.object({ select: CallImportSelectObjectSchema.optional(), data: z.union([ CallImportCreateManyInputObjectSchema, z.array(CallImportCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CallImportCreateManyAndReturnArgs>;

export const CallImportCreateManyAndReturnZodSchema = z.object({ select: CallImportSelectObjectSchema.optional(), data: z.union([ CallImportCreateManyInputObjectSchema, z.array(CallImportCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();