export enum GroupBy {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export interface AnalyticsQuery {
  ciyId?: number;
  siteId?: number;
  startDate: string;
  endDate: string;
}
