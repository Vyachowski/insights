import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

const callimportscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CallImportScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CallImportScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CallImportScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CallImportScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CallImportScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  siteId: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  src: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  region: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  callNumber: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  class: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  projectTitle: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  advChannelName: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  billsec: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  comment: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  redirectNumber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  source: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  importedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CallImportScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CallImportScalarWhereWithAggregatesInput> = callimportscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CallImportScalarWhereWithAggregatesInput>;
export const CallImportScalarWhereWithAggregatesInputObjectZodSchema = callimportscalarwherewithaggregatesinputSchema;
