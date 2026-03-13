import dayjs from 'dayjs';
import type {
  FetchSitesMetricsOptions,
  Site,
  PendingSiteMetric,
  FetchSitesMetricsResult,
} from '../../../types';
import { YandexClient } from './modules/client';
import {
  splitDateRangeIntoChunks,
  formatDateRange,
} from './modules/date-chunkers';
import { ErrorTracker } from './modules/error-tracker';
import { fetchGoalId } from './modules/fetch-goal-id';
import { fetchMetricsForPeriod } from './modules/metrics-fetcher';
import sleep from '../../../utils/sleep';
import getErrorMessage from '../../../utils/getErrorMessage';

const METRICS_SETTINGS = {
  chunkMonths: 1,
  requestDelayMs: 750,
};

async function fetchSiteMetrics(
  site: Site,
  yandexClient: YandexClient,
  options: FetchSitesMetricsOptions,
  errorTracker: ErrorTracker,
): Promise<PendingSiteMetric[]> {
  const allMetrics: PendingSiteMetric[] = [];

  console.log(
    `\n📊 Processing site: ${site.id}${site.name ? ` - ${site.name}` : ''}`,
  );

  try {
    if (!site.yandexCounterId) {
      throw new Error('No Yandex counter ID for this site');
    }

    const goalId = await fetchGoalId(yandexClient, site.yandexCounterId);

    console.log(`  ✓ Found goal 'Заявка': ID=${goalId}`);

    const startDate = dayjs(options.startDate).format('YYYY-MM-DD');
    const endDate = dayjs(options.endDate).format('YYYY-MM-DD');

    const chunks = splitDateRangeIntoChunks(
      startDate,
      endDate,
      METRICS_SETTINGS.chunkMonths,
    ).filter((chunk) => options.years.includes(dayjs(chunk.start).year()));

    console.log(`  📅 Fetching metrics in ${chunks.length} chunk(s)`);

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

        allMetrics.push(...metrics.map((m) => ({ siteId: site.id, ...m })));

        if (index < chunks.length - 1 && METRICS_SETTINGS.requestDelayMs > 0) {
          await sleep(METRICS_SETTINGS.requestDelayMs);
        }
      } catch (err) {
        const message = getErrorMessage(err);

        errorTracker.addError(
          site,
          `Chunk ${formatDateRange(chunk)}: ${message}`,
          'metrics_fetch',
        );
        console.error(`  ❌ Error fetching chunk: ${message}`);
      }
    }

    console.log(
      `  ✅ Finished site ${site.id} (${allMetrics.length} total rows)`,
    );
  } catch (err) {
    const message = getErrorMessage(err);

    errorTracker.addError(site, message, 'goal_fetch');
    console.error(`  ❌ Error processing site: ${message}`);
  }

  return allMetrics;
}

export async function fetchSitesMetrics(
  sites: Site[],
  options: FetchSitesMetricsOptions,
): Promise<FetchSitesMetricsResult> {
  const yandexClient = new YandexClient();
  const errorTracker = new ErrorTracker();
  const allMetrics: PendingSiteMetric[] = [];

  console.log(`🚀 Starting metrics extraction for ${sites.length} site(s)`);
  console.log(
    `📅 Period: ${dayjs(options.startDate).format('YYYY-MM-DD')} to ${dayjs(options.endDate).format('YYYY-MM-DD')} | Years: ${options.years.join(', ')}`,
  );
  console.log(
    `⚙️  Settings: ${METRICS_SETTINGS.chunkMonths} month chunks, ${METRICS_SETTINGS.requestDelayMs}ms delay\n`,
  );

  for (const site of sites) {
    const siteMetrics = await fetchSiteMetrics(
      site,
      yandexClient,
      options,
      errorTracker,
    );
    allMetrics.push(...siteMetrics);
  }

  if (errorTracker.hasErrors()) {
    errorTracker.logErrors();
  }

  return {
    metrics: allMetrics,
    errors: errorTracker.getErrors(),
  };
}
