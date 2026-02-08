import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => CityWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => CityWhereInputObjectSchema).optional().nullable()
}).strict();
export const CityNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.CityNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CityNullableScalarRelationFilter>;
export const CityNullableScalarRelationFilterObjectZodSchema = makeSchema();
