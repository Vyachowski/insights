import type { YandexClient } from "./client";
import type { MetricRow, YandexApiReportResponse } from "./site-metrics-schema";

/**
 * Search engine type classification
 */
type SearchEngine = "yandex" | "google" | "other";

/**
 * Classify search engine from API response
 */
function classifySearchEngine(sourceName: string): SearchEngine {
  const lowerSource = sourceName.toLowerCase();

  if (lowerSource.includes("yandex")) return "yandex";
  if (lowerSource.includes("google")) return "google";
  return "other";
}

/**
 * Fetch daily metrics for a date range from Yandex Metrika API
 *
 * Returns metrics aggregated by day and search engine (yandex/google/other)
 *
 * @param yandexClient - Yandex API client
 * @param counterId - Yandex counter ID
 * @param goalId - Goal ID for conversions (e.g., "Заявка")
 * @param startDate - Start date YYYY-MM-DD
 * @param endDate - End date YYYY-MM-DD
 * @returns Array of daily metrics
 */
export async function fetchMetricsForPeriod(
  yandexClient: YandexClient,
  counterId: string,
  goalId: number | null,
  startDate: string,
  endDate: string,
): Promise<MetricRow[]> {
  if (!goalId) {
    console.warn("No goal ID provided - skipping metrics fetch");
    return [];
  }

  // Build API request parameters
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

  // Fetch data from API
  const response: YandexApiReportResponse = await yandexClient.get(
    "/stat/v1/data",
    params,
  );

  // Aggregate metrics by date
  const metricsMap = new Map<string, MetricRow>();

  for (const row of response.data) {
    // TODO: Check object integrity
    const date = row.dimensions[0]!.name;
    const sourceRaw = row.dimensions[1]!.name;
    const source = classifySearchEngine(sourceRaw);

    // Initialize metric row for this date if not exists
    if (!metricsMap.has(date)) {
      metricsMap.set(date, {
        date,
        yandex_users: 0,
        google_users: 0,
        other_users: 0,
        visit_duration_yandex_in_sec: 0,
        visit_duration_google_in_sec: 0,
        visit_duration_other_in_sec: 0,
        bounce_yandex: 0,
        bounce_google: 0,
        bounce_other: 0,
        leads_yandex: 0,
        leads_google: 0,
        leads_other: 0,
      });
    }

    const metric = metricsMap.get(date)!;
    const users = row.metrics[0] || 0;

    // Accumulate users
    metric[`${source}_users`] += users;

    // Calculate weighted average visit duration
    const prevDuration =
      metric[`visit_duration_${source}_in_sec`] *
      (metric[`${source}_users`] - users);
    const newDuration = (row.metrics[1] || 0) * users;
    const totalUsers = metric[`${source}_users`];
    metric[`visit_duration_${source}_in_sec`] =
      totalUsers > 0 ? (prevDuration + newDuration) / totalUsers : 0;

    // Calculate weighted average bounce rate (convert from % to 0..1)
    const prevBounce =
      metric[`bounce_${source}`] * (metric[`${source}_users`] - users);
    const newBounce = ((row.metrics[2] || 0) / 100) * users;
    metric[`bounce_${source}`] =
      totalUsers > 0 ? (prevBounce + newBounce) / totalUsers : 0;

    // Accumulate leads (goal conversions)
    metric[`leads_${source}`] += row.metrics[3] || 0;
  }

  return Array.from(metricsMap.values());
}
