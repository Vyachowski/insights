import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CitySelectObjectSchema as CitySelectObjectSchema } from './objects/CitySelect.schema';
import { CityCreateManyInputObjectSchema as CityCreateManyInputObjectSchema } from './objects/CityCreateManyInput.schema';

export const CityCreateManyAndReturnSchema: z.ZodType<Prisma.CityCreateManyAndReturnArgs> = z.object({ select: CitySelectObjectSchema.optional(), data: z.union([ CityCreateManyInputObjectSchema, z.array(CityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CityCreateManyAndReturnArgs>;

export const CityCreateManyAndReturnZodSchema = z.object({ select: CitySelectObjectSchema.optional(), data: z.union([ CityCreateManyInputObjectSchema, z.array(CityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();