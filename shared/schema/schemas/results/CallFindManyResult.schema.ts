import * as z from 'zod';
export const CallFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.number().int(),
  siteId: z.number().int(),
  gudokId: z.number().int(),
  projectId: z.number().int(),
  projectTitle: z.string(),
  dst: z.string(),
  advChannelId: z.string(),
  advChannelName: z.string(),
  src: z.string(),
  duration: z.number().int(),
  billsec: z.number().int(),
  callstatus: z.string(),
  date: z.date(),
  region: z.string(),
  callNumber: z.number().int(),
  audio: z.string(),
  source: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
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