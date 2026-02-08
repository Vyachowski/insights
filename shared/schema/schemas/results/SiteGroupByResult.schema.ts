import * as z from 'zod';
export const SiteGroupByResultSchema = z.array(z.object({
  id: z.number().int(),
  city_id: z.number().int(),
  name: z.string(),
  url: z.string(),
  yandex_counter_id: z.string(),
  google_counter_id: z.string(),
  yandex_tag_manager_id: z.string(),
  google_tag_manager_id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    city_id: z.number(),
    name: z.number(),
    url: z.number(),
    yandex_counter_id: z.number(),
    google_counter_id: z.number(),
    yandex_tag_manager_id: z.number(),
    google_tag_manager_id: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    city: z.number(),
    calls: z.number(),
    callsRaw: z.number(),
    metrics: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    city_id: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    city_id: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    city_id: z.number().int().nullable(),
    name: z.string().nullable(),
    url: z.string().nullable(),
    yandex_counter_id: z.string().nullable(),
    google_counter_id: z.string().nullable(),
    yandex_tag_manager_id: z.string().nullable(),
    google_tag_manager_id: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    city_id: z.number().int().nullable(),
    name: z.string().nullable(),
    url: z.string().nullable(),
    yandex_counter_id: z.string().nullable(),
    google_counter_id: z.string().nullable(),
    yandex_tag_manager_id: z.string().nullable(),
    google_tag_manager_id: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));