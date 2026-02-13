import * as z from 'zod';

export const CallSchema = z.object({
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
  source: z.string().default("webhook"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CallType = z.infer<typeof CallSchema>;
