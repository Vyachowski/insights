import config from "../../config/config";
import { createResultMessage } from "../utils/create-result-mesage";
import { YandexClient } from "./client";
import { fetchGoalId } from "./fetch-goal-id";
import type { Site } from "../utils/validators";
import { appendMetricsToCSV, initializeCSVFile } from "./csv-writer";
import { splitDateRangeIntoChunks, formatDateRange } from "./date-chunkers";
import { ErrorTracker } from "./error-tracker";
import { fetchMetricsForPeriod } from "./metrics-fetcher";
import type { MetricsSettings, SiteMetricRow } from "./site-metrics-schema";

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
    if (!site.yandex_counter_id) {
      throw new Error("No Yandex counter ID for this site");
    }

    const goalId = await fetchGoalId(yandexClient, site.yandex_counter_id);

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
          site.yandex_counter_id,
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
export async function createSiteMetricsCSV(sitesAll: Site[]) {
  const yandexClient = new YandexClient();
  const outputPath = config.paths.output.siteMetrics;
  const errorTracker = new ErrorTracker();
  const allMetrics: SiteMetricRow[] = [];
  const [site1, ..._] = sitesAll;
  const sites = [site1] as Site[];

  console.log(`🚀 Starting metrics extraction for ${sites.length} site(s)`);
  console.log(
    `📅 Period: ${config.IMPORT_START_DATE} to ${config.IMPORT_END_DATE}`,
  );
  console.log(
    `⚙️  Settings: ${METRICS_SETTINGS.chunkMonths} month chunks, ${METRICS_SETTINGS.requestDelayMs}ms delay\n`,
  );

  // Initialize CSV file (clear previous data)
  await initializeCSVFile(outputPath);

  // Process each site
  for (const site of sites) {
    const siteMetrics = await processSite(
      site,
      yandexClient,
      outputPath,
      errorTracker,
    );
    allMetrics.push(...siteMetrics);
  }

  // TODO: DELETE EXCESS LOGGING
  // Log summary
  // console.log("\n" + "=".repeat(60));
  // console.log("📊 METRICS EXTRACTION SUMMARY");
  // console.log("=".repeat(60));
  // console.log(`✅ Total sites processed: ${sites.length}`);
  // console.log(`📝 Total metric rows: ${allMetrics.length}`);
  // console.log(`❌ Errors encountered: ${errorTracker.getErrorCount()}`);
  // console.log(`📄 Output file: ${outputPath}`);
  // console.log("=".repeat(60));

  // Log errors if any
  if (errorTracker.hasErrors()) {
    errorTracker.logErrors();
  }

  return {
    data: allMetrics,
    errors: errorTracker.getErrors(),
    message: createResultMessage("Site Metrics", allMetrics.length, outputPath),
  };
}
