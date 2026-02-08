import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CallImportSelectObjectSchema as CallImportSelectObjectSchema } from './objects/CallImportSelect.schema';
import { CallImportUpdateManyMutationInputObjectSchema as CallImportUpdateManyMutationInputObjectSchema } from './objects/CallImportUpdateManyMutationInput.schema';
import { CallImportWhereInputObjectSchema as CallImportWhereInputObjectSchema } from './objects/CallImportWhereInput.schema';

export const CallImportUpdateManyAndReturnSchema: z.ZodType<Prisma.CallImportUpdateManyAndReturnArgs> = z.object({ select: CallImportSelectObjectSchema.optional(), data: CallImportUpdateManyMutationInputObjectSchema, where: CallImportWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CallImportUpdateManyAndReturnArgs>;

export const CallImportUpdateManyAndReturnZodSchema = z.object({ select: CallImportSelectObjectSchema.optional(), data: CallImportUpdateManyMutationInputObjectSchema, where: CallImportWhereInputObjectSchema.optional() }).strict();