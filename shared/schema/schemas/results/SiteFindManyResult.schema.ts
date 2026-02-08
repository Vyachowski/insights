import * as z from 'zod';
export const SiteFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.number().int(),
  city_id: z.number().int(),
  name: z.string(),
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});