import * as z from "zod";

export const CitySchema = z.object({
  id: z.coerce.number().positive(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  population: z.coerce.number().positive(),
});

export const SiteSchema = z.object({
  id: z.coerce.number().positive(),
  cityId: z.coerce.number().positive().min(1),
  name: z.string().min(1).optional(),
  group: z.string().min(1).optional(),
  url: z.string().min(1),
  yandexCounterId: z.string(),
  googleCounterId: z.string(),
  yandexTagManagerId: z.string(),
  googleTagManagerId: z.string(),
});

export const CallSchema = z.object({
  cityId: z.coerce.number().positive().min(1),
  dateTime: z.coerce.date(),
  callerNumber: z.string().min(1),
  region: z.string().min(1),
  callOrder: z.coerce.number().int().positive(),
  class: z.string().nullable(),
  numberName: z.string().nullable(),
  project: z.string().min(1),
  durationInSec: z.coerce.number().int().nonnegative().nullable(),
  comment: z.string().nullable(),
  redirectNumber: z.string().nullable(),
});

export const RevenueSchema = z.object({
  cityId: z.preprocess((val) => {
    if (val === "" || val == null) return null;
    return Number(val);
  }, z.number().nullable()),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
});

export const ExpenseSchema = z.object({
  cityId: z.coerce.number().int().positive().nullable(),
  date: z.coerce.date(),
  amount: z.coerce.number().positive(),
  type: z.string().min(1),
  comment: z.string().optional(),
});

export const SiteMetricSchema = z.object({
  siteId: z.coerce.number().int().positive(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  yandexUsers: z.coerce.number().int().nonnegative().default(0),
  googleUsers: z.coerce.number().int().nonnegative().default(0),
  otherUsers: z.coerce.number().int().nonnegative().default(0),
  visitDurationYandexInSec: z.coerce.number().nonnegative().default(0),
  visitDurationGoogleInSec: z.coerce.number().nonnegative().default(0),
  visitDurationOtherInSec: z.coerce.number().nonnegative().default(0),
  bounceYandex: z.coerce.number().nonnegative().default(0),
  bounceGoogle: z.coerce.number().nonnegative().default(0),
  bounceOther: z.coerce.number().nonnegative().default(0),
  leadsYandex: z.coerce.number().int().nonnegative().default(0),
  leadsGoogle: z.coerce.number().int().nonnegative().default(0),
  leadsOther: z.coerce.number().int().nonnegative().default(0),
});
