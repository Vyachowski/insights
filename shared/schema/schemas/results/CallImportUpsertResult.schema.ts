import * as z from 'zod';
export const CallImportUpsertResultSchema = z.object({
  id: z.number().int(),
  siteId: z.number().int(),
  date: z.date(),
  src: z.string(),
  region: z.string().optional(),
  callNumber: z.number().int(),
  class: z.string().optional(),
  projectTitle: z.string(),
  advChannelName: z.string(),
  billsec: z.number().int(),
  comment: z.string().optional(),
  redirectNumber: z.string().optional(),
  source: z.string(),
  importedAt: z.date(),
  site: z.unknown()
});