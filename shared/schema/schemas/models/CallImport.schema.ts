import * as z from 'zod';

export const CallImportSchema = z.object({
  id: z.number().int(),
  site_id: z.number().int(),
  date: z.date(),
  src: z.string(),
  region: z.string().nullish(),
  call_number: z.number().int(),
  class: z.string().nullish(),
  project_title: z.string(),
  adv_channel_name: z.string(),
  billsec: z.number().int(),
  comment: z.string().nullish(),
  redirect_number: z.string().nullish(),
  source: z.string().default("csv"),
  imported_at: z.date(),
});

export type CallImportType = z.infer<typeof CallImportSchema>;
