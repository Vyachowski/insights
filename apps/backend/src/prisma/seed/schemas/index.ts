import z from 'zod';

export const CityImportSchema = z.object({
  id: z.string(),
  code: z.string(),
  slug: z.string(),
  name: z.string(),
  population: z.string(),
});

export const SiteImportSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  name: z.string(),
  group: z.string(),
  url: z.string(),
  yandexCounterId: z.string(),
  googleCounterId: z.string(),
  yandexTagManagerId: z.string(),
  googleTagManagerId: z.string(),
});

export type CityImport = z.infer<typeof CityImportSchema>;
export type SiteImport = z.infer<typeof SiteImportSchema>;
