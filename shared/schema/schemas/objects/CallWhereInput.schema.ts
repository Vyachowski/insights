import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { SiteScalarRelationFilterObjectSchema as SiteScalarRelationFilterObjectSchema } from './SiteScalarRelationFilter.schema';
import { SiteWhereInputObjectSchema as SiteWhereInputObjectSchema } from './SiteWhereInput.schema'

const callwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CallWhereInputObjectSchema), z.lazy(() => CallWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CallWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CallWhereInputObjectSchema), z.lazy(() => CallWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  site_id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  gudok_id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  project_id: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  project_title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  dst: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  adv_channel_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  adv_channel_name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  src: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  duration: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  billsec: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  callstatus: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  region: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  call_number: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  audio: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  site: z.union([z.lazy(() => SiteScalarRelationFilterObjectSchema), z.lazy(() => SiteWhereInputObjectSchema)]).optional()
}).strict();
export const CallWhereInputObjectSchema: z.ZodType<Prisma.CallWhereInput> = callwhereinputSchema as unknown as z.ZodType<Prisma.CallWhereInput>;
export const CallWhereInputObjectZodSchema = callwhereinputSchema;
