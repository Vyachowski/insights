import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';
import { SiteCreateNestedOneWithoutCallsInputObjectSchema as SiteCreateNestedOneWithoutCallsInputObjectSchema } from './SiteCreateNestedOneWithoutCallsInput.schema'

const makeSchema = () => z.object({
  gudok_id: z.number().int(),
  project_id: z.number().int(),
  project_title: z.string(),
  dst: z.string(),
  adv_channel_id: z.string(),
  adv_channel_name: z.string(),
  src: z.string(),
  duration: z.number().int(),
  billsec: z.number().int(),
  callstatus: z.string(),
  date: z.coerce.date(),
  region: z.string(),
  call_number: z.number().int(),
  audio: z.string(),
  source: z.string().optional(),
  created_at: z.coerce.date().optional(),
  site: z.lazy(() => SiteCreateNestedOneWithoutCallsInputObjectSchema)
}).strict();
export const CallCreateInputObjectSchema: z.ZodType<Prisma.CallCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CallCreateInput>;
export const CallCreateInputObjectZodSchema = makeSchema();
