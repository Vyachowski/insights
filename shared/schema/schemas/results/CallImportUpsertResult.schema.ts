import * as z from 'zod';
export const CallImportUpsertResultSchema = z.object({
  id: z.number().int(),
  site_id: z.number().int(),
  date: z.date(),
  src: z.string(),
  region: z.string().optional(),
  call_number: z.number().int(),
  class: z.string().optional(),
  project_title: z.string(),
  adv_channel_name: z.string(),
  billsec: z.number().int(),
  comment: z.string().optional(),
  redirect_number: z.string().optional(),
  source: z.string(),
  imported_at: z.date(),
  site: z.unknown()
});