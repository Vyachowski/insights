import * as z from 'zod';
// prettier-ignore
export const SiteInputSchema = z.object({
    id: z.number().int(),
    cityId: z.number().int(),
    name: z.string().optional().nullable(),
    group: z.string().optional().nullable(),
    url: z.string(),
    yandexCounterId: z.string(),
    googleCounterId: z.string().optional().nullable(),
    yandexTagManagerId: z.string().optional().nullable(),
    googleTagManagerId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown(),
    calls: z.array(z.unknown()),
    callsImport: z.array(z.unknown()),
    metrics: z.array(z.unknown())
}).strict();

export type SiteInputType = z.infer<typeof SiteInputSchema>;
