import { z } from "zod";

/**
 * Single metric row - daily metrics aggregated by search engine
 */
export const MetricRowSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  yandex_users: z.number().min(0),
  google_users: z.number().min(0),
  other_users: z.number().min(0),
  visit_duration_yandex_in_sec: z.number().min(0),
  visit_duration_google_in_sec: z.number().min(0),
  visit_duration_other_in_sec: z.number().min(0),
  bounce_yandex: z.number().min(0).max(1), // 0..1
  bounce_google: z.number().min(0).max(1),
  bounce_other: z.number().min(0).max(1),
  leads_yandex: z.number().min(0),
  leads_google: z.number().min(0),
  leads_other: z.number().min(0),
});

export type MetricRow = z.infer<typeof MetricRowSchema>;

/**
 * Metric row with site_id for CSV output
 */
export const SiteMetricRowSchema = MetricRowSchema.extend({
  site_id: z.number().positive(),
});

export type SiteMetricRow = z.infer<typeof SiteMetricRowSchema>;

/**
 * Yandex API response structure
 */
export interface YandexApiReportResponse {
  data: Array<{
    dimensions: Array<{ name: string; id?: string }>;
    metrics: number[];
  }>;
  total_rows?: number;
  totals?: number[];
  min?: number[];
  max?: number[];
}

/**
 * Processing error for a site
 */
export interface SiteProcessingError {
  site_id: number;
  site_name?: string;
  error_message: string;
  step: "goal_fetch" | "metrics_fetch" | "csv_write";
}

/**
 * Date range chunk for API requests
 */
export interface DateChunk {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

/**
 * Settings for metrics extraction
 */
export interface MetricsSettings {
  chunkMonths: number; // Split period into N-month chunks
  requestDelayMs: number; // Delay between API requests
}
