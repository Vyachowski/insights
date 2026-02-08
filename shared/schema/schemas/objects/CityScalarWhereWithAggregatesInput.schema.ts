import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const cityscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CityScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  population: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CityScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CityScalarWhereWithAggregatesInput> = cityscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CityScalarWhereWithAggregatesInput>;
export const CityScalarWhereWithAggregatesInputObjectZodSchema = cityscalarwherewithaggregatesinputSchema;
