import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportUpdateManyMutationInputObjectSchema as CallImportUpdateManyMutationInputObjectSchema } from './objects/CallImportUpdateManyMutationInput.schema';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './objects/CallImportWhereInput.schema';

export const CallImportUpdateManySchema: z.ZodType<Prisma.CallImportUpdateManyArgs> = z.object({ data: CallImportUpdateManyMutationInputObjectSchema, where: CallImportWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallImportUpdateManyArgs>;

export const CallImportUpdateManyZodSchema = z.object({ data: CallImportUpdateManyMutationInputObjectSchema, where: CallImportWhereInputObjectSchema.optional() }).strict();