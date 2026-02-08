import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityIncludeObjectSchema as CityIncludeObjectSchema } from './objects/CityInclude.schema';
import { CityWhereUniqueInputObjectSchema as CityWhereUniqueInputObjectSchema } from './objects/CityWhereUniqueInput.schema';
import { CityCreateInputObjectSchema as CityCreateInputObjectSchema } from './objects/CityCreateInput.schema';
import { CityUncheckedCreateInputObjectSchema as CityUncheckedCreateInputObjectSchema } from './objects/CityUncheckedCreateInput.schema';
import { CityUpdateInputObjectSchema as CityUpdateInputObjectSchema } from './objects/CityUpdateInput.schema';
import { CityUncheckedUpdateInputObjectSchema as CityUncheckedUpdateInputObjectSchema } from './objects/CityUncheckedUpdateInput.schema';

export const CityUpsertOneSchema: z.ZodType<Prisma.CityUpsertArgs> = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), where: CityWhereUniqueInputObjectSchema, create: z.union([ CityCreateInputObjectSchema, CityUncheckedCreateInputObjectSchema ]), update: z.union([ CityUpdateInputObjectSchema, CityUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.CityUpsertArgs>;

export const CityUpsertOneZodSchema = z.object({ select: CitySelectObjectSchema.optional(), include: CityIncludeObjectSchema.optional(), where: CityWhereUniqueInputObjectSchema, create: z.union([ CityCreateInputObjectSchema, CityUncheckedCreateInputObjectSchema ]), update: z.union([ CityUpdateInputObjectSchema, CityUncheckedUpdateInputObjectSchema ]) }).strict();