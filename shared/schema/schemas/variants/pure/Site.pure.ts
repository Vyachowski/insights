import * as z from 'zod';
// prettier-ignore
export const SiteModelSchema = z.object({
    id: z.number().int(),
    cityId: z.number().int(),
    name: z.string().nullable(),
    group: z.string().nullable(),
    url: z.string(),
    yandexCounterId: z.string(),
    googleCounterId: z.string().nullable(),
    yandexTagManagerId: z.string().nullable(),
    googleTagManagerId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    city: z.unknown(),
    calls: z.array(z.unknown()),
    callsImport: z.array(z.unknown()),
    metrics: z.array(z.unknown())
}).strict();

export type SitePureType = z.infer<typeof SiteModelSchema>;
