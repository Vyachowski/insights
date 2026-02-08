import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './objects/CityInclude.schema';
import { CityCreateInputObjectSchema as CityCreateInputObjectSchema } from './objects/CityCreateInput.schema';
import { CityUncheckedCreateInputObjectSchema as CityUncheckedCreateInputObjectSchema } from './objects/CityUncheckedCreateInput.schema';

export const CityCreateOneSchema: z.ZodType<Prisma.CityCreateArgs> = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), data: z.union([CityCreateInputObjectSchema, CityUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.CityCreateArgs>;

export const CityCreateOneZodSchema = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), data: z.union([CityCreateInputObjectSchema, CityUncheckedCreateInputObjectSchema]) }).strict();