import * as z from 'zod';

export const SiteMetricScalarFieldEnumSchema = z.enum(['id', 'siteId', 'date', 'yandexUsers', 'googleUsers', 'otherUsers', 'visitDurationYandexInSec', 'visitDurationGoogleInSec', 'visitDurationOtherInSec', 'bounceYandex', 'bounceGoogle', 'bounceOther', 'leadsYandex', 'leadsGoogle', 'leadsOther'])

export type SiteMetricScalarFieldEnum = z.infer<typeof SiteMetricScalarFieldEnumSchema>;