import type {
  FetchSitesMetricsOptions,
  SiteMetric,
  PendingSiteMetric,
} from '../../../types';

import { createResultMessage } from '../../../utils/create-result-message';
import { initializeCSVFile, appendMetricsToCSV } from './modules/csv-writer';
import path from 'path';

export interface SiteProcessingError {
  site_id: number;
  site_name?: string;
  error_message: string;
  step: 'goal_fetch' | 'metrics_fetch' | 'csv_write';
}

export async function writeSiteMetricsCSV(
  metrics: Omit<SiteMetric, 'id'>[],
  errors: SiteProcessingError[],
  options: FetchSitesMetricsOptions,
  outputPath: string,
) {
  const minYear = Math.min(...options.years);
  const maxYear = Math.max(...options.years);

  const start = `${minYear}-01-01`;
  const end = `${maxYear}-12-31`;

  const outputFilePath = path.join(
    outputPath,
    `${start}_${end}_site-metrics.csv`,
  );

  await initializeCSVFile(outputFilePath);

  // FIXME: Try to switch to 2024 ecmascript
  // const bySite = Map.groupBy(metrics, (row) => row.siteId);
  const bySite = new Map<number, PendingSiteMetric[]>();

  for (const row of metrics) {
    const list = bySite.get(row.siteId);

    if (list) {
      list.push(row);
    } else {
      bySite.set(row.siteId, [row]);
    }
  }

  for (const [siteId, rows] of bySite) {
    await appendMetricsToCSV(outputFilePath, siteId, rows);
  }

  return {
    data: metrics,
    errors,
    message: createResultMessage(
      'Site Metrics',
      metrics.length,
      outputFilePath,
    ),
  };
}
