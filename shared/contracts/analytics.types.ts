export enum GroupBy {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export interface AnalyticsQuery {
  cityId?: number;
  siteId?: number;
  startDate?: string;
  endDate?: string;
  groupBy?: GroupBy;
}
