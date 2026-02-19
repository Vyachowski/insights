import fs from "fs/promises";
import config from "../../config";
import { createResultMessage } from "../utils/create-result-mesage";

import type { Site } from "../../types";
import { YandexClient } from "./modules/client";
import { appendMetricsToCSV, initializeCSVFile } from "./modules/csv-writer";
import { splitDateRangeIntoChunks, formatDateRange } from "./modules/date-chunkers";
import { ErrorTracker } from "./modules/error-tracker";
import { fetchGoalId } from "./modules/fetch-goal-id";
import { fetchMetricsForPeriod } from "./modules/metrics-fetcher";
import type { MetricsSettings, SiteMetricRow } from "./modules/site-metrics-schema";

/**
 * Settings for metrics extraction
 */
const METRICS_SETTINGS: MetricsSettings = {
  chunkMonths: 1, // Process 1 month at a time to avoid API errors
  requestDelayMs: 750, // 750ms delay between requests
};

/**
 * Sleep utility
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Process single site: fetch metrics and write to CSV
 */
async function processSite(
  site: Site,
  yandexClient: YandexClient,
  outputPath: string,
  errorTracker: ErrorTracker,
): Promise<SiteMetricRow[]> {
  const allMetrics: SiteMetricRow[] = [];

  console.log(
    `\n📊 Processing site: ${site.id}${site.name ? ` - ${site.name}` : ""}`,
  );

  try {
    // Step 1: Get goal ID
    if (!site.yandexCounterId) {
      throw new Error("No Yandex counter ID for this site");
    }

    const goalId = await fetchGoalId(yandexClient, site.yandexCounterId);

    if (!goalId) {
      console.log("  ⚠️  Goal 'Заявка' not found - skipping site");
      return allMetrics;
    }

    console.log(`  ✓ Found goal 'Заявка': ID=${goalId}`);

    // Step 2: Split date range into chunks
    const chunks = splitDateRangeIntoChunks(
      config.IMPORT_START_DATE,
      config.IMPORT_END_DATE,
      METRICS_SETTINGS.chunkMonths,
    );

    console.log(`  📅 Fetching metrics in ${chunks.length} chunk(s)`);

    // Step 3: Fetch metrics for each chunk
    for (const [index, chunk] of chunks.entries()) {
      console.log(
        `  [${index + 1}/${chunks.length}] ${formatDateRange(chunk)}`,
      );

      try {
        const metrics = await fetchMetricsForPeriod(
          yandexClient,
          site.yandexCounterId,
          goalId,
          chunk.start,
          chunk.end,
        );

        // Write to CSV immediately (append mode)
        await appendMetricsToCSV(outputPath, site.id, metrics);

        // Collect all metrics for return
        const siteMetrics: SiteMetricRow[] = metrics.map((m) => ({
          site_id: site.id,
          ...m,
        }));
        allMetrics.push(...siteMetrics);

        // Delay before next request
        if (index < chunks.length - 1 && METRICS_SETTINGS.requestDelayMs > 0) {
          await sleep(METRICS_SETTINGS.requestDelayMs);
        }
      } catch (err: any) {
        errorTracker.addError(
          site,
          `Chunk ${formatDateRange(chunk)}: ${err.message}`,
          "metrics_fetch",
        );
        console.error(`  ❌ Error fetching chunk: ${err.message}`);
        // Continue with next chunk
      }
    }

    console.log(
      `  ✅ Finished site ${site.id} (${allMetrics.length} total rows)`,
    );
  } catch (err: any) {
    errorTracker.addError(site, err.message, "goal_fetch");
    console.error(`  ❌ Error processing site: ${err.message}`);
  }

  return allMetrics;
}

/**
 * Create site metrics CSV file
 *
 * Fetches metrics from Yandex Metrika API for all sites and writes to CSV
 *
 * Process:
 * 1. Initialize CSV file
 * 2. For each site:
 *    a. Find "Заявка" goal ID
 *    b. Split date range into monthly chunks
 *    c. Fetch metrics for each chunk
 *    d. Append to CSV immediately
 * 3. Return all metrics and any errors
 *
 * @param sites - Array of sites to process
 * @returns Object with all metrics data and result message
 */
export async function createSiteMetricsCSV(
  sites: Site[],
  options?: { source: "api" | "backup" },
) {
  if (options?.source === "backup") {
    const importFilePath = config.paths.input.siteMetricsBackup;
    const outputFilePath = config.paths.output.siteMetrics;

    await fs.copyFile(importFilePath, outputFilePath);

    return {
      message: createResultMessage("Site Metrics", 22_781, outputFilePath),
      data: null,
    };
  }

  const yandexClient = new YandexClient();
  const outputPath = config.paths.output.siteMetrics;
  const errorTracker = new ErrorTracker();
  const allMetrics: SiteMetricRow[] = [];

  console.log(`🚀 Starting metrics extraction for ${sites.length} site(s)`);
  console.log(
    `📅 Period: ${config.IMPORT_START_DATE} to ${config.IMPORT_END_DATE}`,
  );
  console.log(
    `⚙️  Settings: ${METRICS_SETTINGS.chunkMonths} month chunks, ${METRICS_SETTINGS.requestDelayMs}ms delay\n`,
  );

  await initializeCSVFile(outputPath);

  for (const site of sites) {
    const siteMetrics = await processSite(
      site,
      yandexClient,
      outputPath,
      errorTracker,
    );
    allMetrics.push(...siteMetrics);
  }

  if (errorTracker.hasErrors()) {
    errorTracker.logErrors();
  }

  return {
    data: allMetrics,
    errors: errorTracker.getErrors(),
    message: createResultMessage("Site Metrics", allMetrics.length, outputPath),
  };
}
