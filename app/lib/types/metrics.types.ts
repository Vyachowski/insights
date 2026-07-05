export interface SiteMetricDto {
  id: number
  siteId: number
  date: string | Date
  yandexUsers: number
  googleUsers: number
  otherUsers: number
  visitDurationYandexInSec: number
  visitDurationGoogleInSec: number
  visitDurationOtherInSec: number
  bounceYandex: number
  bounceGoogle: number
  bounceOther: number
  leadsYandex: number
  leadsGoogle: number
  leadsOther: number
}
