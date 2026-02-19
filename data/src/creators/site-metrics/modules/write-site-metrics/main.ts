import type { SiteMetric } from "@/types";
import config from "@/config";
import { createResultMessage } from "../../../utils/create-result-mesage";
import { initializeCSVFile, appendMetricsToCSV } from "./modules/csv-writer";

export interface SiteProcessingError {
  site_id: number;
  site_name?: string;
  error_message: string;
  step: "goal_fetch" | "metrics_fetch" | "csv_write";
}

export async function writeSiteMetricsCSV(
  metrics: Omit<SiteMetric, 'id'>[],
  errors: SiteProcessingError[],
) {
  const outputPath = config.paths.output.siteMetrics;

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
