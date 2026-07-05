import { z } from 'zod';

const emptyToNull = (value: string) => (value === '' ? null : value);

export const CITY_CSV_COLUMNS = ['id', 'code', 'slug', 'name', 'population'];

export const cityRowSchema = z.object({
  id: z.coerce.number().int().positive(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  population: z.coerce.number().int().nonnegative(),
});

export const SITE_CSV_COLUMNS = [
  'id',
  'cityId',
  'name',
  'group',
  'url',
  'yandexCounterId',
  'googleCounterId',
  'yandexTagManagerId',
  'googleTagManagerId',
];

export const siteRowSchema = z.object({
  id: z.coerce.number().int().positive(),
  cityId: z.coerce.number().int().positive(),
  name: z.string().transform(emptyToNull),
  group: z.string().transform(emptyToNull),
  url: z.url(),
  yandexCounterId: z.string().min(1),
  googleCounterId: z.string().transform(emptyToNull),
  yandexTagManagerId: z.string().transform(emptyToNull),
  googleTagManagerId: z.string().transform(emptyToNull),
});
