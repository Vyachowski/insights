import * as z from 'zod';
export const SiteUpdateResultSchema = z.nullable(z.object({
  id: z.number().int(),
  cityId: z.number().int(),
  name: z.string().optional(),
  group: z.string().optional(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string().optional(),
  yandexTagManagerId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  city: z.unknown(),
  calls: z.array(z.unknown()),
  callsImport: z.array(z.unknown()),
  metrics: z.array(z.unknown())
}));