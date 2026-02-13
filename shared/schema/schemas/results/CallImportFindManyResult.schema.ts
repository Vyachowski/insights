import * as z from 'zod';
export const CallImportFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});