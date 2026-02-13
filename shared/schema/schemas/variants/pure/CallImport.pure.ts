import * as z from 'zod';
// prettier-ignore
export const CallImportModelSchema = z.object({
    id: z.number().int(),
    siteId: z.number().int(),
    date: z.date(),
    src: z.string(),
    region: z.string().nullable(),
    callNumber: z.number().int(),
    class: z.string().nullable(),
    projectTitle: z.string(),
    advChannelName: z.string(),
    billsec: z.number().int(),
    comment: z.string().nullable(),
    redirectNumber: z.string().nullable(),
    source: z.string(),
    importedAt: z.date(),
    site: z.unknown()
}).strict();

export type CallImportPureType = z.infer<typeof CallImportModelSchema>;
