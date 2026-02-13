import * as z from 'zod';
// prettier-ignore
export const CallImportInputSchema = z.object({
    id: z.number().int(),
    siteId: z.number().int(),
    date: z.date(),
    src: z.string(),
    region: z.string().optional().nullable(),
    callNumber: z.number().int(),
    class: z.string().optional().nullable(),
    projectTitle: z.string(),
    advChannelName: z.string(),
    billsec: z.number().int(),
    comment: z.string().optional().nullable(),
    redirectNumber: z.string().optional().nullable(),
    source: z.string(),
    importedAt: z.date(),
    site: z.unknown()
}).strict();

export type CallImportInputType = z.infer<typeof CallImportInputSchema>;
