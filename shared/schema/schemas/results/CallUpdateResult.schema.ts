import * as z from 'zod';
export const CallUpdateResultSchema = z.nullable(z.object({
  id: z.number().int(),
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
  date: z.date(),
  region: z.string(),
  call_number: z.number().int(),
  audio: z.string(),
  source: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  site: z.unknown()
}));