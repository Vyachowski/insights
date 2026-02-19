import type { FetchSitesMetricsOptions, SiteMetric } from "@/types";
import config from "@/config";
import { createResultMessage } from "../../../utils/create-result-mesage";
import { initializeCSVFile, appendMetricsToCSV } from "./modules/csv-writer";
import path from "path";

export interface SiteProcessingError {
  site_id: number;
  site_name?: string;
  error_message: string;
  step: "goal_fetch" | "metrics_fetch" | "csv_write";
}

export async function writeSiteMetricsCSV(
  metrics: Omit<SiteMetric, 'id'>[],
  errors: SiteProcessingError[],
  options: FetchSitesMetricsOptions,
) {
  const minYear = Math.min(...options.years);
  const maxYear = Math.max(...options.years);

  const start = `${minYear}-01-01`;
  const end = `${maxYear}-12-31`;

  const outputPath = path.join(
    config.paths.output.siteMetricsDir,
    `${start}_${end}_site-metrics.csv`,
  );

  await initializeCSVFile(outputPath);

  const bySite = Map.groupBy(metrics, (row) => row.siteId);

  for (const [siteId, rows] of bySite) {
    await appendMetricsToCSV(outputPath, siteId, rows);
  }

  return {
    data: metrics,
    errors,
    message: createResultMessage("Site Metrics", metrics.length, outputPath),
  };
}
