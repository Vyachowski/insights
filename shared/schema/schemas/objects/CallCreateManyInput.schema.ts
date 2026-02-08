import * as z from 'zod';
import type { Prisma } from '../../../../server/generated/prisma/client';


const makeSchema = () => z.object({
  id: z.number().int().optional(),
  site_id: z.number().int(),
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
  updated_at: z.coerce.date().optional()
}).strict();
export const CallCreateManyInputObjectSchema: z.ZodType<Prisma.CallCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.CallCreateManyInput>;
export const CallCreateManyInputObjectZodSchema = makeSchema();
