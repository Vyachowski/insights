import * as z from 'zod';

export const SiteMetricScalarFieldEnumSchema = z.enum(['id', 'site_id', 'date', 'yandex_users', 'google_users', 'other_users', 'visit_duration_yandex_in_sec', 'visit_duration_google_in_sec', 'visit_duration_other_in_sec', 'bounce_yandex', 'bounce_google', 'bounce_other', 'leads_yandex', 'leads_google', 'leads_other'])

export type SiteMetricScalarFieldEnum = z.infer<typeof SiteMetricScalarFieldEnumSchema>;