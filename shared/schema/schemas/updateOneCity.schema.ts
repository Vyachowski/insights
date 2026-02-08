import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './objects/CityInclude.schema';
import { CityUpdateInputObjectSchema as CityUpdateInputObjectSchema } from './objects/CityUpdateInput.schema';
import { CityUncheckedUpdateInputObjectSchema as CityUncheckedUpdateInputObjectSchema } from './objects/CityUncheckedUpdateInput.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';

export const CityUpdateOneSchema: z.ZodType<Prisma.CityUpdateArgs> = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), data: z.union([CityUpdateInputObjectSchema, CityUncheckedUpdateInputObjectSchema]), where: CityWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.CityUpdateArgs>;

export const CityUpdateOneZodSchema = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), data: z.union([CityUpdateInputObjectSchema, CityUncheckedUpdateInputObjectSchema]), where: CityWhereUniqueInputObjectSchema }).strict();