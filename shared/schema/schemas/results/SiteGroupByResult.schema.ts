import * as z from 'zod';
export const SiteGroupByResultSchema = z.array(z.object({
  id: z.number().int(),
  cityId: z.number().int(),
  name: z.string(),
  group: z.string(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string(),
  yandexTagManagerId: z.string(),
  googleTagManagerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    cityId: z.number(),
    name: z.number(),
    group: z.number(),
    url: z.number(),
    yandexCounterId: z.number(),
    googleCounterId: z.number(),
    yandexTagManagerId: z.number(),
    googleTagManagerId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    city: z.number(),
    calls: z.number(),
    callsImport: z.number(),
    metrics: z.number()
  }).optional(),
  _sum: z.object({
    id: z.number().nullable(),
    cityId: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable(),
    cityId: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.number().int().nullable(),
    cityId: z.number().int().nullable(),
    name: z.string().nullable(),
    group: z.string().nullable(),
    url: z.string().nullable(),
    yandexCounterId: z.string().nullable(),
    googleCounterId: z.string().nullable(),
    yandexTagManagerId: z.string().nullable(),
    googleTagManagerId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.number().int().nullable(),
    cityId: z.number().int().nullable(),
    name: z.string().nullable(),
    group: z.string().nullable(),
    url: z.string().nullable(),
    yandexCounterId: z.string().nullable(),
    googleCounterId: z.string().nullable(),
    yandexTagManagerId: z.string().nullable(),
    googleTagManagerId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));