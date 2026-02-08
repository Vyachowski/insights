import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const callscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CallScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CallScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CallScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CallScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CallScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  site_id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  gudok_id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  project_id: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  project_title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  dst: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  adv_channel_id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  adv_channel_name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  src: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  duration: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  billsec: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  callstatus: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  region: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  call_number: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  audio: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  source: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CallScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CallScalarWhereWithAggregatesInput> = callscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CallScalarWhereWithAggregatesInput>;
export const CallScalarWhereWithAggregatesInputObjectZodSchema = callscalarwherewithaggregatesinputSchema;
