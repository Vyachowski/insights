import config from '../../config';
import type { MetricRow } from './metrics';
import { createObjectCsvWriter } from 'csv-writer';

// Настройка csv-writer
const csvWriter = createObjectCsvWriter({
  path: config.paths.siteMetrics,
  header: [
    { id: 'site_id', title: 'site_id' },
    { id: 'date', title: 'date' },
    { id: 'yandex_users', title: 'yandex_users' },
    { id: 'google_users', title: 'google_users' },
    { id: 'other_users', title: 'other_users' },
    { id: 'visit_duration_yandex_in_sec', title: 'visit_duration_yandex_in_sec' },
    { id: 'visit_duration_google_in_sec', title: 'visit_duration_google_in_sec' },
    { id: 'visit_duration_other_in_sec', title: 'visit_duration_other_in_sec' },
    { id: 'bounce_yandex', title: 'bounce_yandex' },
    { id: 'bounce_google', title: 'bounce_google' },
    { id: 'bounce_other', title: 'bounce_other' },
    { id: 'leads_yandex', title: 'leads_yandex' },
    { id: 'leads_google', title: 'leads_google' },
    { id: 'leads_other', title: 'leads_other' },
  ],
  append: false, // перезаписываем при каждом запуске
});

/**
 * Записывает метрики в CSV
 */
export async function writeMetricsToCsv(siteId: number, metrics: MetricRow[]) {
  if (!metrics || metrics.length === 0) return;

  // Добавляем site_id к каждой строке
  const records = metrics.map(m => ({ site_id: siteId, ...m }));

  await csvWriter.writeRecords(records);
  console.log(`✅ Metrics for site ${siteId} written to CSV (${metrics.length} rows)`);
}
