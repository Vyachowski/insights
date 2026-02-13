import * as z from 'zod';

export const CallImportSchema = z.object({
  id: z.number().int(),
  siteId: z.number().int(),
  date: z.date(),
  src: z.string(),
  region: z.string().nullish(),
  callNumber: z.number().int(),
  class: z.string().nullish(),
  projectTitle: z.string(),
  advChannelName: z.string(),
  billsec: z.number().int(),
  comment: z.string().nullish(),
  redirectNumber: z.string().nullish(),
  source: z.string().default("csv"),
  importedAt: z.date(),
});

export type CallImportType = z.infer<typeof CallImportSchema>;
