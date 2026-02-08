import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './objects/CallImportWhereInput.schema';

export const CallImportDeleteManySchema: z.ZodType<Prisma.CallImportDeleteManyArgs> = z.object({ where: CallImportWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallImportDeleteManyArgs>;

export const CallImportDeleteManyZodSchema = z.object({ where: CallImportWhereInputObjectSchema.optional() }).strict();