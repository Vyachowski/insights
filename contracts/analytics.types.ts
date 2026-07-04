export const GroupBy = Object.freeze({
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
} as const)

export type GroupBy = typeof GroupBy[keyof typeof GroupBy]


export interface AnalyticsQuery {
  ciyId?: number;
  siteId?: number;
  startDate: string;
  endDate: string;
}
