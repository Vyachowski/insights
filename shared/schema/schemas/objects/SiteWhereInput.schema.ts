import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { CityScalarRelationFilterObjectSchema as CityScalarRelationFilterObjectSchema } from './CityScalarRelationFilter.schema';
import { CityWhereInputObjectSchema as CityWhereInputObjectSchema } from './CityWhereInput.schema';
import { CallListRelationFilterObjectSchema as CallListRelationFilterObjectSchema } from './CallListRelationFilter.schema';
import { CallImportListRelationFilterObjectSchema as CallImportListRelationFilterObjectSchema } from './CallImportListRelationFilter.schema';
import { SiteMetricListRelationFilterObjectSchema as SiteMetricListRelationFilterObjectSchema } from './SiteMetricListRelationFilter.schema'

const sitewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SiteWhereInputObjectSchema), z.lazy(() => SiteWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SiteWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SiteWhereInputObjectSchema), z.lazy(() => SiteWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  cityId: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  group: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  url: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  yandexCounterId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  googleCounterId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  yandexTagManagerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  googleTagManagerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  city: z.union([z.lazy(() => CityScalarRelationFilterObjectSchema), z.lazy(() => CityWhereInputObjectSchema)]).optional(),
  calls: z.lazy(() => CallListRelationFilterObjectSchema).optional(),
  callsImport: z.lazy(() => CallImportListRelationFilterObjectSchema).optional(),
  metrics: z.lazy(() => SiteMetricListRelationFilterObjectSchema).optional()
}).strict();
export const SiteWhereInputObjectSchema: z.ZodType<Prisma.SiteWhereInput> = sitewhereinputSchema as unknown as z.ZodType<Prisma.SiteWhereInput>;
export const SiteWhereInputObjectZodSchema = sitewhereinputSchema;
