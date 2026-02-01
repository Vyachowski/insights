import { YandexClient } from './client';
import { getZayavkaGoalId } from './goals';
import { getDailyMetrics, type MetricRow } from './metrics';
import { getAllSites } from './db';
import { writeMetricsToCsv } from './csvWriter';
import { START_DATE, END_DATE } from './config';
import dayjs from 'dayjs';

async function main() {
  const sites = await getAllSites();
  const yc = new YandexClient();

  console.log(`🚀 Starting metrics extraction for ${sites.length} sites`);
  
  for (const site of sites) {
    console.log(`\n📊 Processing site: ${site.id} - ${site.name}`);

    try {
      const goalId = await getZayavkaGoalId(yc, site.yandex_counter_id!);
      console.log(`Goal "Заявка" found: ID=${goalId}`);

      if (!goalId) {
        console.log('Цель не найдена — пропускаем сайт');
        continue;
      }

      let start = dayjs(START_DATE);
      const end = dayjs(END_DATE);

      while (start.isBefore(end) || start.isSame(end, 'day')) {
        const yearStart = start.startOf('year');
        const yearEnd = yearStart.endOf('year').isBefore(end) ? yearStart.endOf('year') : end;

        console.log(`Fetching metrics from ${yearStart.format('YYYY-MM-DD')} to ${yearEnd.format('YYYY-MM-DD')}`);

        const metrics: MetricRow[] = await getDailyMetrics(
          yc,
          site.yandex_counter_id!,
          goalId,
          yearStart.format('YYYY-MM-DD'),
          yearEnd.format('YYYY-MM-DD')
        );

        await writeMetricsToCsv(site.id, metrics);

        start = yearEnd.add(1, 'day');
      }

      console.log(`✅ Finished site ${site.id}`);
    } catch (err: any) {
      console.error(`❌ Error processing site ${site.id}:`, err.message);
    }
  }

  console.log('\n🎉 All done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
