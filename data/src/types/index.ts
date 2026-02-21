import type z from "zod";
import type {
  CitySchema,
  SiteSchema,
  CallSchema,
  RevenueSchema,
  ExpenseSchema,
  SiteMetricSchema,
} from "@shared/schema/schemas";

export type City = z.infer<typeof CitySchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Call = z.infer<typeof CallSchema>;
export type Revenue = z.infer<typeof RevenueSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
export type SiteMetric = z.infer<typeof SiteMetricSchema>;

export type SiteMetricRow = Omit<SiteMetric, "id" | "siteId">;
export interface FetchSitesMetricsOptions {
  startDate: Date;
  endDate: Date;
  years: number[];
}

export interface InputPaths {
  cities: string;
  sites: string;
  calls: string;
  revenue: string;
  revenueFolder: string;
  siteMetrics: string;
}

export interface OutputPaths {
  cities: string;
  sites: string;
  calls: string;
  revenue: string;
  siteMetricsDir: string;
  siteMetrics: string;
  expenses: string;
}

export interface RunOptions {
  logger?: (...args: unknown[]) => void;
  breaker?: string;
  cleanerFunc: (dir: string) => Promise<void>;
}

export interface RunParams {
  inputPaths: Readonly<InputPaths>;
  outputPaths: Readonly<OutputPaths>;
  outputDir: string;
  startDate: string,
  endDate: string,
  options: RunOptions;
}
