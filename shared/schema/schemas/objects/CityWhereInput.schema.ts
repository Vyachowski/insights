import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { SiteListRelationFilterObjectSchema as SiteListRelationFilterObjectSchema } from './SiteListRelationFilter.schema';
import { RevenueListRelationFilterObjectSchema as RevenueListRelationFilterObjectSchema } from './RevenueListRelationFilter.schema';
import { ExpenseListRelationFilterObjectSchema as ExpenseListRelationFilterObjectSchema } from './ExpenseListRelationFilter.schema'

const citywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CityWhereInputObjectSchema), z.lazy(() => CityWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CityWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CityWhereInputObjectSchema), z.lazy(() => CityWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  population: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  sites: z.lazy(() => SiteListRelationFilterObjectSchema).optional(),
  revenues: z.lazy(() => RevenueListRelationFilterObjectSchema).optional(),
  expenses: z.lazy(() => ExpenseListRelationFilterObjectSchema).optional()
}).strict();
export const CityWhereInputObjectSchema: z.ZodType<Prisma.CityWhereInput> = citywhereinputSchema as unknown as z.ZodType<Prisma.CityWhereInput>;
export const CityWhereInputObjectZodSchema = citywhereinputSchema;
