import * as z from 'zod';
// prettier-ignore
export const CallImportInputSchema = z.object({
    id: z.number().int(),
    site_id: z.number().int(),
    date: z.date(),
    src: z.string(),
    region: z.string().optional().nullable(),
    call_number: z.number().int(),
    class: z.string().optional().nullable(),
    project_title: z.string(),
    adv_channel_name: z.string(),
    billsec: z.number().int(),
    comment: z.string().optional().nullable(),
    redirect_number: z.string().optional().nullable(),
    source: z.string(),
    imported_at: z.date(),
    site: z.unknown()
}).strict();

export type CallImportInputType = z.infer<typeof CallImportInputSchema>;
