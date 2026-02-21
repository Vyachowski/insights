import path, { join } from "path";

export default function resolveInputPaths(rootPath: string, filePrefix: string) {
  const inputFolderPath = join(rootPath, "data", "input");
  const tempMetricsPrefix = '2021-05-01_2025-12-31_'

  return Object.freeze({
    cities: path.resolve(inputFolderPath, 'cities.csv'),
    sites: path.resolve(inputFolderPath, 'sites.csv'),
    calls: path.resolve(inputFolderPath, `${filePrefix}calls.csv`),
    revenue: path.resolve(inputFolderPath, `${filePrefix}revenue.json`),
    revenueFolder: path.resolve(inputFolderPath, `${filePrefix}revenue-tg`),
    siteMetrics: path.resolve(
      inputFolderPath,
      `${tempMetricsPrefix}site-metrics.csv`,
    ),
    oldSiteMetrics: path.resolve(inputFolderPath, `archive/${filePrefix}site-metrics.csv`)
  })
}
