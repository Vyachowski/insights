import * as z from 'zod';
// prettier-ignore
export const SiteInputSchema = z.object({
    id: z.number().int(),
    city_id: z.number().int(),
    name: z.string(),
    url: z.string(),
    yandex_counter_id: z.string(),
    google_counter_id: z.string().optional().nullable(),
    yandex_tag_manager_id: z.string().optional().nullable(),
    google_tag_manager_id: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown(),
    calls: z.array(z.unknown()),
    callsRaw: z.array(z.unknown()),
    metrics: z.array(z.unknown())
}).strict();

export type SiteInputType = z.infer<typeof SiteInputSchema>;
