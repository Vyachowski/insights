import { YandexClient } from "./utils/site-metrics/client";
import { getZayavkaGoalId } from "./utils/site-metrics/goals";
import { getDailyMetrics, type MetricRow } from "./utils/site-metrics/metrics";
import { getAllSites } from "./utils/site-metrics/db";
import { writeMetricsToCsv } from "./utils/site-metrics/csvWriter";
import config from "../../config/config";
import dayjs from "dayjs";

// TODO: REFACTORING
const settings = {
  METRICS_CHUNK_MONTHS: 1,
  METRICS_REQUEST_DELAY_MS: 750,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createSiteMetricsCSV() {
  const sites = await getAllSites();
  const yc = new YandexClient();

  console.log(`🚀 Starting metrics extraction for ${sites.length} sites`);

  for (const site of sites) {
    console.log(`\n📊 Processing site: ${site.id} - ${site.name}`);

    try {
      const goalId = await getZayavkaGoalId(yc, site.yandex_counter_id!);
      console.log(`Goal "Заявка" found: ID=${goalId}`);

      if (!goalId) {
        console.log("Цель не найдена — пропускаем сайт");
        continue;
      }

      let start = dayjs(config.IMPORT_START_DATE);
      const end = dayjs(config.IMPORT_END_DATE);

      const CHUNK_MONTHS = settings.METRICS_CHUNK_MONTHS ?? 6;
      const DELAY_MS = settings.METRICS_REQUEST_DELAY_MS ?? 500;

      while (start.isBefore(end) || start.isSame(end, "day")) {
        const chunkEnd = start.add(CHUNK_MONTHS, "month").subtract(1, "day");

        const effectiveEnd = chunkEnd.isAfter(end) ? end : chunkEnd;

        console.log(
          `Fetching metrics from ${start.format("YYYY-MM-DD")} to ${effectiveEnd.format("YYYY-MM-DD")}`,
        );

        const metrics: MetricRow[] = await getDailyMetrics(
          yc,
          site.yandex_counter_id!,
          goalId,
          start.format("YYYY-MM-DD"),
          effectiveEnd.format("YYYY-MM-DD"),
        );

        await writeMetricsToCsv(site.id, metrics);

        if (DELAY_MS > 0) {
          await sleep(DELAY_MS);
        }

        start = effectiveEnd.add(1, "day");
      }

      console.log(`✅ Finished site ${site.id}`);
    } catch (err: any) {
      console.error(`❌ Error processing site ${site.id}:`, err.message);
    }
  }

  console.log("\n🎉 All done!");
}
