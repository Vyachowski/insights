type CSVImport = Record<string, string>[];

export function normalizeCallImportData(
  callsImport: CSVImport,
): { [k: string]: string | number }[] {
  return callsImport.map((call) => ({
    ...call,
    site_id: Number(call.site_id),
    call_number: Number(call.call_number),
    billsec: Number(call.billsec),
  }));
}

export function normalizeSites(
  sitesImport: CSVImport,
): { [k: string]: string | number }[] {
  return sitesImport.map((site) => ({
    ...site,
    id: Number(site.id),
    city_id: Number(site.city_id),
  }));
}

export function normalizeCities(
  citiesImport: CSVImport,
): { [k: string]: string | number }[] {
  return citiesImport.map((city) => ({
    ...city,
    id: Number(city.id),
    population: Number(city.population),
  }));
}
