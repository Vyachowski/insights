import * as z from 'zod';

export const SiteSchema = z.object({
  id: z.number().int(),
  city_id: z.number().int(),
  name: z.string().nullish(),
  group: z.string().nullish(),
  url: z.string(),
  yandex_counter_id: z.string(),
  google_counter_id: z.string().nullish(),
  yandex_tag_manager_id: z.string().nullish(),
  google_tag_manager_id: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SiteType = z.infer<typeof SiteSchema>;
