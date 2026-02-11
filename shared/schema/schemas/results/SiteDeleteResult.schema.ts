import * as z from 'zod';
export const SiteDeleteResultSchema = z.nullable(z.object({
  id: z.number().int(),
  city_id: z.number().int(),
  name: z.string().optional(),
  group: z.string().optional(),
  url: z.string(),
  yandex_counter_id: z.string(),
  google_counter_id: z.string().optional(),
  yandex_tag_manager_id: z.string().optional(),
  google_tag_manager_id: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  city: z.unknown(),
  calls: z.array(z.unknown()),
  callsRaw: z.array(z.unknown()),
  metrics: z.array(z.unknown())
}));