import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './objects/CityInclude.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';

export const CityDeleteOneSchema: z.ZodType<Prisma.CityDeleteArgs> = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), where: CityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CityDeleteArgs>;

export const CityDeleteOneZodSchema = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), where: CityWhereUniqueInputObjectSchema }).strict();