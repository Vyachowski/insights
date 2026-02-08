import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityUpdateManyMutationInputObjectSchema as CityUpdateManyMutationInputObjectSchema } from './objects/CityUpdateManyMutationInput.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';

export const CityUpdateManyAndReturnSchema: z.ZodType<Prisma.CityUpdateManyAndReturnArgs> = z.object({ select: CitySelectObjectSchema.optional(), data: CityUpdateManyMutationInputObjectSchema, where: CityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CityUpdateManyAndReturnArgs>;

export const CityUpdateManyAndReturnZodSchema = z.object({ select: CitySelectObjectSchema.optional(), data: CityUpdateManyMutationInputObjectSchema, where: CityWhereInputObjectSchema.optional() }).strict();