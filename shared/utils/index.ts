import path, { join } from "path";
import { fileURLToPath } from "url";

export function defineRepoRootPath() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return path.resolve(__dirname, "../../");
}

export function resolveSharedPaths(rootPath: string, filePrefix: string) {
  const folderPath = join(rootPath, "shared", "seed-data");

  return Object.freeze({
    folderPath,
    filePaths: {
      cities: path.resolve(folderPath, 'cities.csv'),
      sites: path.resolve(folderPath, 'sites.csv'),
      calls: path.resolve(folderPath, `${filePrefix}calls.csv`),
      revenue: path.resolve(folderPath, `${filePrefix}revenue.csv`),
      siteMetricsDir: path.resolve(folderPath, "site-metrics"),
      siteMetrics: path.resolve(
        folderPath,
        `${filePrefix}site-metrics.csv`,
      ),
      expenses: path.resolve(folderPath, `${filePrefix}expenses.csv`),
    },
  })
 }
