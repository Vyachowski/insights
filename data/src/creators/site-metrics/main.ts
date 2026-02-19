import type { FetchSitesMetricsOptions, Site } from "../../types";
import { copyMetricsBackup } from "./modules/copy-metrics-backup";
import { fetchSitesMetrics } from "./modules/fetch-site-metrics/main";
import { writeSiteMetricsCSV } from "./modules/write-site-metrics/main";

type MetricsOptions =
  | { source: "backup" }
  | ({ source: "api" } & FetchSitesMetricsOptions);

export async function createSiteMetricsCSV(sites: Site[], options: MetricsOptions) {
  if (options.source === "backup") {
    return await copyMetricsBackup();
  }

  const { metrics, errors } = await fetchSitesMetrics(sites, options);
  return await writeSiteMetricsCSV(metrics, errors, options);
}
