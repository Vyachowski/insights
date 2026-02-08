import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityUpdateManyMutationInputObjectSchema as CityUpdateManyMutationInputObjectSchema } from './objects/CityUpdateManyMutationInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';

export const CityUpdateManySchema: z.ZodType<Prisma.CityUpdateManyArgs> = z.object({ data: CityUpdateManyMutationInputObjectSchema, where: CityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CityUpdateManyArgs>;

export const CityUpdateManyZodSchema = z.object({ data: CityUpdateManyMutationInputObjectSchema, where: CityWhereInputObjectSchema.optional() }).strict();