import * as z from 'zod';
// prettier-ignore
export const CallImportModelSchema = z.object({
    id: z.number().int(),
    site_id: z.number().int(),
    date: z.date(),
    src: z.string(),
    region: z.string().nullable(),
    call_number: z.number().int(),
    class: z.string().nullable(),
    project_title: z.string(),
    adv_channel_name: z.string(),
    billsec: z.number().int(),
    comment: z.string().nullable(),
    redirect_number: z.string().nullable(),
    source: z.string(),
    imported_at: z.date(),
    site: z.unknown()
}).strict();

export type CallImportPureType = z.infer<typeof CallImportModelSchema>;
