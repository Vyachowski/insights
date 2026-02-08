import type { Prisma } from '../../../server/generated/prisma/client';
import * as z from 'zod';
import { CityCreateManyInputObjectSchema as CityCreateManyInputObjectSchema } from './objects/CityCreateManyInput.schema';

export const CityCreateManySchema: z.ZodType<Prisma.CityCreateManyArgs> = z.object({ data: z.union([ CityCreateManyInputObjectSchema, z.array(CityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.CityCreateManyArgs>;

export const CityCreateManyZodSchema = z.object({ data: z.union([ CityCreateManyInputObjectSchema, z.array(CityCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();