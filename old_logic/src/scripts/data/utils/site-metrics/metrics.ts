import { YandexClient } from './client';

export interface MetricRow {
  date: string; // YYYY-MM-DD
  yandex_users: number;
  google_users: number;
  other_users: number;
  visit_duration_yandex_in_sec: number;
  visit_duration_google_in_sec: number;
  visit_duration_other_in_sec: number;
  bounce_yandex: number; // доля 0..1
  bounce_google: number;
  bounce_other: number;
  leads_yandex: number;
  leads_google: number;
  leads_other: number;
}

interface YandexApiReportResponse {
  data: any[];
}

/**
 * Получает метрики по дням для заданного счетчика и цели
 * @param counterId ID счетчика
 * @param goalId ID цели "Заявка"
 * @param startDate YYYY-MM-DD
 * @param endDate YYYY-MM-DD
 */
export async function getDailyMetrics(
  yandexClient: YandexClient,
  counterId: string,
  goalId: number | null,
  startDate: string,
  endDate: string
): Promise<MetricRow[]> {

  if (!goalId) {
    console.log('Цель не задана — данные не запрашиваются');
    return [];
  }

  const params = {
    ids: counterId,
    metrics: `ym:s:users,ym:s:avgVisitDurationSeconds,ym:s:bounceRate,ym:s:goal${goalId}users`,
    dimensions: 'ym:s:date,ym:s:lastSearchEngineRoot',
    filters: "ym:s:trafficSource=='organic'",
    robots: 'no',
    date1: startDate,
    date2: endDate,
    accuracy: 'full',
    limit: 10000,
  };

  const response: YandexApiReportResponse = await yandexClient.get(`/stat/v1/data`, params);

  const resultMap = new Map<string, MetricRow>();

  for (const row of response.data) {
    const date = row.dimensions[0].name;
    const sourceRaw = row.dimensions[1].name.toLowerCase();

    const source = sourceRaw.includes('yandex') ? 'yandex' :
                   sourceRaw.includes('google') ? 'google' : 'other';

    if (!resultMap.has(date)) {
      resultMap.set(date, {
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

    const metric = resultMap.get(date)!;

    // users
    metric[`${source}_users`] += row.metrics[0] || 0;

    // visit duration (среднее)
    const prevDuration = metric[`visit_duration_${source}_in_sec`] * metric[`${source}_users`];
    const newDuration = row.metrics[1] * row.metrics[0];
    metric[`visit_duration_${source}_in_sec`] = (prevDuration + newDuration) / (metric[`${source}_users`] || 1);

    // bounce
    const prevBounce = metric[`bounce_${source}`] * metric[`${source}_users`];
    const newBounce = row.metrics[2] * row.metrics[0] / 100;
    metric[`bounce_${source}`] = (prevBounce + newBounce) / (metric[`${source}_users`] || 1);

    // leads
    metric[`leads_${source}`] += row.metrics[3] || 0;
  }

  return Array.from(resultMap.values());
}
