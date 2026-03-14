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

export const CallImportSchema = z.object({
  Дата: z.string(),
  'Кто звонил': z.string(),
  Откуда: z.string(),
  '№': z.string(),
  Класс: z.string(),
  Проект: z.string(),
  'Куда звонил': z.string(),
  Запись: z.string(),
  Комментарий: z.string(),
  'Вызов завершен': z.string(),
});

export const RevenueImportSchema = z.object({
  cityId: z.string(),
  date: z.string(),
  amount: z.string(),
});

export const ExpenseImportSchema = z.object({
  date: z.string(),
  type: z.string(),
  cityId: z.string(),
  amount: z.string(),
});

export const SiteMetricsImportSchema = z.object({
  siteId: z.string(),
  date: z.string(),

  yandexUsers: z.string(),
  googleUsers: z.string(),
  otherUsers: z.string(),

  visitDurationYandexInSec: z.string(),
  visitDurationGoogleInSec: z.string(),
  visitDurationOtherInSec: z.string(),

  bounceYandex: z.string(),
  bounceGoogle: z.string(),
  bounceOther: z.string(),

  leadsYandex: z.string(),
  leadsGoogle: z.string(),
  leadsOther: z.string(),
});

export type CityImport = z.infer<typeof CityImportSchema>;
export type SiteImport = z.infer<typeof SiteImportSchema>;
export type CallImport = z.infer<typeof CallImportSchema>;
export type RevenueImport = z.infer<typeof RevenueImportSchema>;
export type ExpenseImport = z.infer<typeof ExpenseImportSchema>;
export type SiteMetricsImport = z.infer<typeof SiteMetricsImportSchema>;
