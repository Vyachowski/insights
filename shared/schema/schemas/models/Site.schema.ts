import * as z from 'zod';

export const SiteSchema = z.object({
  id: z.number().int(),
  cityId: z.number().int(),
  name: z.string().nullish(),
  group: z.string().nullish(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string().nullish(),
  yandexTagManagerId: z.string().nullish(),
  googleTagManagerId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SiteType = z.infer<typeof SiteSchema>;
