import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { SiteScalarRelationFilterObjectSchema as SiteScalarRelationFilterObjectSchema } from './SiteScalarRelationFilter.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const callimportwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CallImportWhereInputObjectSchema), z.lazy(() => CallImportWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CallImportWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CallImportWhereInputObjectSchema), z.lazy(() => CallImportWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  site_id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  src: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  region: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  call_number: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  class: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  project_title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  adv_channel_name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  billsec: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  comment: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  redirect_number: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  imported_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  site: z.union([z.lazy(() => SiteScalarRelationFilterObjectSchema), z.lazy(() => SiteWhereInputObjectSchema)]).optional()
}).strict();
export const CallImportWhereInputObjectSchema: z.ZodType<Prisma.CallImportWhereInput> = callimportwhereinputSchema as unknown as z.ZodType<Prisma.CallImportWhereInput>;
export const CallImportWhereInputObjectZodSchema = callimportwhereinputSchema;
