export interface SiteMetric {
  id: number
  siteId: number
  date: string
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
