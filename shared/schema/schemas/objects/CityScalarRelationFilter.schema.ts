import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => CityWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => CityWhereInputObjectSchema).optional()
}).strict();
export const CityScalarRelationFilterObjectSchema: z.ZodType<Prisma.CityScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CityScalarRelationFilter>;
export const CityScalarRelationFilterObjectZodSchema = makeSchema();
