import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './objects/CityWhereInput.schema';

export const CityDeleteManySchema: z.ZodType<Prisma.CityDeleteManyArgs> = z.object({ where: CityWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CityDeleteManyArgs>;

export const CityDeleteManyZodSchema = z.object({ where: CityWhereInputObjectSchema.optional() }).strict();