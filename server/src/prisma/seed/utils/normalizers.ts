type CSVImport = Record<string, string>[];

export function normalizeCallImportData(callsImport: CSVImport) {
  return callsImport.map((call) => ({
    ...call,
    siteId: Number(call.siteId),
    callNumber: Number(call.callNumber),
    billsec: Number(call.billsec),
  }));
}

export function normalizeSites(sitesImport: CSVImport) {
  return sitesImport.map((site) => ({
    ...site,
    id: Number(site.id),
    cityId: Number(site.cityId),
  }));
}

export function normalizeCities(citiesImport: CSVImport) {
  return citiesImport.map((city) => ({
    ...city,
    id: Number(city.id),
    population: Number(city.population),
  }));
}

export function normalizeRevenue(revenueImport: CSVImport) {
  return revenueImport.map((rev) => ({
    ...rev,
    cityId: rev.cityId ? rev.cityId : null,
    date: new Date(rev.date),
    amount: Number(rev.amount),
  }));
}

export function normalizeExpenses(expensesImport: CSVImport) {
  return expensesImport.map((exp) => ({
    ...exp,
    date: new Date(exp.date),
    cityId: exp.cityId ? Number(exp.cityId) : null,
    amount: Number(exp.amount),
  }));
}

export function normalizeSiteMetrics(siteMetricsImport: CSVImport) {
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
