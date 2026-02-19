import type { SiteMetric } from "@/types";
import type { YandexClient } from "./client";

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

type SearchEngine = "yandex" | "google" | "other";
type Cap<S extends string> = Capitalize<S>;

type SiteMetricRow = Omit<SiteMetric, "id" | "siteId">;

function classifySearchEngine(sourceName: string): SearchEngine {
  const lowerSource = sourceName.toLowerCase();
  if (lowerSource.includes("yandex")) return "yandex";
  if (lowerSource.includes("google")) return "google";
  return "other";
}

export async function fetchMetricsForPeriod(
  yandexClient: YandexClient,
  counterId: string,
  goalId: number | null,
  startDate: string,
  endDate: string,
): Promise<SiteMetricRow[]> {
  if (!goalId) {
    console.warn("No goal ID provided - skipping metrics fetch");
    return [];
  }

  const params = {
    ids: counterId,
    metrics: `ym:s:users,ym:s:avgVisitDurationSeconds,ym:s:bounceRate,ym:s:goal${goalId}users`,
    dimensions: "ym:s:date,ym:s:lastSearchEngineRoot",
    filters: "ym:s:trafficSource=='organic'",
    robots: "no",
    date1: startDate,
    date2: endDate,
    accuracy: "full",
    limit: 10000,
  };

  const response: YandexApiReportResponse = await yandexClient.get(
    "/stat/v1/data",
    params,
  );

  const cap = <S extends string>(s: S): Cap<S> =>
    (s.charAt(0).toUpperCase() + s.slice(1)) as Cap<S>;

  const metricsMap = new Map<string, SiteMetricRow>();

  for (const row of response.data) {
    // TODO: Check object integrity
    const date = row.dimensions[0]!.name;
    const sourceRaw = row.dimensions[1]!.name;
    const source = classifySearchEngine(sourceRaw);

    if (!metricsMap.has(date)) {
      metricsMap.set(date, {
        date: new Date(date),
        yandexUsers: 0,
        googleUsers: 0,
        otherUsers: 0,
        visitDurationYandexInSec: 0,
        visitDurationGoogleInSec: 0,
        visitDurationOtherInSec: 0,
        bounceYandex: 0,
        bounceGoogle: 0,
        bounceOther: 0,
        leadsYandex: 0,
        leadsGoogle: 0,
        leadsOther: 0,
      });
    }

    const metric = metricsMap.get(date)!;
    const users = row.metrics[0] ?? 0;

    // Accumulate users
    metric[`${source}Users`] += users;

    // Calculate weighted average visit duration
    const prevDuration =
      metric[`visitDuration${cap(source)}InSec`] *
      (metric[`${source}Users`] - users);
    const newDuration = (row.metrics[1] ?? 0) * users;
    const totalUsers = metric[`${source}Users`];
    metric[`visitDuration${cap(source)}InSec`] =
      totalUsers > 0 ? (prevDuration + newDuration) / totalUsers : 0;

    // Calculate weighted average bounce rate (convert from % to 0..1)
    const prevBounce =
      metric[`bounce${cap(source)}`] * (metric[`${source}Users`] - users);
    const newBounce = ((row.metrics[2] ?? 0) / 100) * users;
    metric[`bounce${cap(source)}`] =
      totalUsers > 0 ? (prevBounce + newBounce) / totalUsers : 0;

    // Accumulate leads (goal conversions)
    metric[`leads${cap(source)}`] += row.metrics[3] ?? 0;
  }

  return Array.from(metricsMap.values());
}
