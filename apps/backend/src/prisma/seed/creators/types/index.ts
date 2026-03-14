import type z from 'zod';
import type {
  CitySchema,
  SiteSchema,
  SiteMetricSchema,
} from '@/prisma/generated/schemas';

export type City = z.infer<typeof CitySchema>;
export type Site = z.infer<typeof SiteSchema>;
export type SiteMetric = z.infer<typeof SiteMetricSchema>;

export type SiteMetricRow = Omit<SiteMetric, 'id' | 'siteId'>;

export interface FetchSitesMetricsOptions {
  startDate: Date;
  endDate: Date;
  years: number[];
}

export type MetricsOptions =
  | { source: 'backup' }
  | ({ source: 'api' } & FetchSitesMetricsOptions);

export type PendingSiteMetric = SiteMetricRow & { siteId: number };

export interface SiteProcessingError {
  site_id: number;
  site_name?: string;
  error_message: string;
  step: 'goal_fetch' | 'metrics_fetch' | 'csv_write';
}

export interface FetchSitesMetricsResult {
  metrics: PendingSiteMetric[];
  errors: SiteProcessingError[];
}

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

export type SearchEngine = 'yandex' | 'google' | 'other';
export type Cap<S extends string> = Capitalize<S>;
