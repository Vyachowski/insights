import * as z from 'zod';
// prettier-ignore
export const SiteResultSchema = z.object({
    id: z.number().int(),
    city_id: z.number().int(),
    name: z.string().nullable(),
    group: z.string().nullable(),
    url: z.string(),
    yandex_counter_id: z.string(),
    google_counter_id: z.string().nullable(),
    yandex_tag_manager_id: z.string().nullable(),
    google_tag_manager_id: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown(),
    calls: z.array(z.unknown()),
    callsImport: z.array(z.unknown()),
    metrics: z.array(z.unknown())
}).strict();

export type SiteResultType = z.infer<typeof SiteResultSchema>;
