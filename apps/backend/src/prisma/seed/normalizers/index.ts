import type {
  CallImport,
  CityImport,
  ExpenseImport,
  RevenueImport,
  SiteImport,
  SiteMetricsImport,
} from '../schemas';
import { normalizeCallRow } from './normalize-calls-row';

export function normalizeCities(citiesImport: CityImport[]) {
  return citiesImport.map((city) => ({
    ...city,
    id: Number(city.id),
    population: Number(city.population),
  }));
}

export function normalizeSites(sitesImport: SiteImport[]) {
  return sitesImport.map((site) => ({
    ...site,
    id: Number(site.id),
    cityId: Number(site.cityId),
  }));
}

export function normalizeRevenue(revenueImport: RevenueImport[]) {
  return revenueImport.map((rev) => ({
    ...rev,
    siteId: rev.siteId ? rev.siteId : null,
    date: rev.date,
    amount: Number(rev.amount),
  }));
}

export function normalizeCalls(callsImport: CallImport[]) {
  return callsImport.map(normalizeCallRow);
}

export function normalizeExpenses(expensesImport: ExpenseImport[]) {
  return expensesImport.map((exp) => ({
    ...exp,
    date: exp.date,
    siteId: exp.siteId ? Number(exp.siteId) : null,
    amount: Number(exp.amount),
  }));
}

export function normalizeSiteMetrics(siteMetricsImport: SiteMetricsImport[]) {
  return siteMetricsImport.map((metrics) => ({
    ...metrics,
    siteId: Number(metrics.siteId),
    yandexUsers: Number(metrics.yandexUsers),
    googleUsers: Number(metrics.googleUsers),
    otherUsers: Number(metrics.otherUsers),
    visitDurationYandexInSec: Number(metrics.visitDurationYandexInSec),
    visitDurationGoogleInSec: Number(metrics.visitDurationGoogleInSec),
    visitDurationOtherInSec: Number(metrics.visitDurationOtherInSec),
    bounceYandex: Number(metrics.bounceYandex),
    bounceGoogle: Number(metrics.bounceGoogle),
    bounceOther: Number(metrics.bounceOther),
    leadsYandex: Number(metrics.leadsYandex),
    leadsGoogle: Number(metrics.leadsGoogle),
    leadsOther: Number(metrics.leadsOther),
  }));
}
