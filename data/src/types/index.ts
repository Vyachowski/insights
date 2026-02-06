import type z from "zod";
import type {
  CitySchema,
  SiteSchema,
  CallSchema,
  RevenueSchema,
  ExpenseSchema,
  SiteMetricSchema,
} from "../schemas";

export type City = z.infer<typeof CitySchema>;
export type Site = z.infer<typeof SiteSchema>;
export type Call = z.infer<typeof CallSchema>;
export type Revenue = z.infer<typeof RevenueSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
export type SiteMetric = z.infer<typeof SiteMetricSchema>;
