import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

const callimportscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CallImportScalarWhereInputObjectSchema), z.lazy(() => CallImportScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CallImportScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CallImportScalarWhereInputObjectSchema), z.lazy(() => CallImportScalarWhereInputObjectSchema).array()]).optional(),
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
  imported_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CallImportScalarWhereInputObjectSchema: z.ZodType<Prisma.CallImportScalarWhereInput> = callimportscalarwhereinputSchema as unknown as z.ZodType<Prisma.CallImportScalarWhereInput>;
export const CallImportScalarWhereInputObjectZodSchema = callimportscalarwhereinputSchema;
