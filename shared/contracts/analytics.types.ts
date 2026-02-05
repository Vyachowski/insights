export enum GroupBy {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export interface AnalyticsQuery {
  city_id?: number;
  site_id?: number;
  start_date?: string;
  end_date?: string;
}
