import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './objects/CityInclude.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';

export const CityFindUniqueSchema: z.ZodType<Prisma.CityFindUniqueArgs> = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), where: CityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CityFindUniqueArgs>;

export const CityFindUniqueZodSchema = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), where: CityWhereUniqueInputObjectSchema }).strict();