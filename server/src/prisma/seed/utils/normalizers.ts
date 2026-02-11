type CSVImport = Record<string, string>[];

export function normalizeCallImportData(callsImport: CSVImport) {
  return callsImport.map((call) => ({
    ...call,
    site_id: Number(call.site_id),
    call_number: Number(call.call_number),
    billsec: Number(call.billsec),
  }));
}

export function normalizeSites(sitesImport: CSVImport) {
  return sitesImport.map((site) => ({
    ...site,
    id: Number(site.id),
    city_id: Number(site.city_id),
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
    city_id: rev.city_id ? rev.city_id : null,
    date: new Date(rev.date),
    amount: Number(rev.amount),
  }));
}

export function normalizeExpenses(expensesImport: CSVImport) {
  return expensesImport.map((exp) => ({
    ...exp,
    date: new Date(exp.date),
    city_id: exp.city_id ? Number(exp.city_id) : null,
    amount: Number(exp.amount),
  }));
}

export function normalizeSiteMetrics(siteMetricsImport: CSVImport) {
  return siteMetricsImport.map((metrics) => ({
    ...metrics,
    site_id: Number(metrics.site_id),
    yandex_users: Number(metrics.yandex_users),
    google_users: Number(metrics.google_users),
    other_users: Number(metrics.other_users),
    visit_duration_yandex_in_sec: Number(metrics.visit_duration_yandex_in_sec),
    visit_duration_google_in_sec: Number(metrics.visit_duration_google_in_sec),
    visit_duration_other_in_sec: Number(metrics.visit_duration_other_in_sec),
    bounce_yandex: Number(metrics.bounce_yandex),
    bounce_google: Number(metrics.bounce_google),
    bounce_other: Number(metrics.bounce_other),
    leads_yandex: Number(metrics.leads_yandex),
    leads_google: Number(metrics.leads_google),
    leads_other: Number(metrics.leads_other),
  }));
}
