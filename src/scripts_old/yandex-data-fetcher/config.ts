// src/config.ts
import appRootPath from 'app-root-path';
import "dotenv/config";
import path from 'path';

export const YANDEX_TOKEN = process.env.YANDEX_API_OAUTH_TOKEN;
if (!YANDEX_TOKEN) throw new Error("YANDEX_API_OAUTH_TOKEN not set in .env");

export const START_DATE = '2021-05-01';
export const END_DATE = '2025-12-31';

export const CSV_PATH = path.resolve(appRootPath.path, 'data/site-metrics/site_metrics.csv');

// Размер батча по месяцам
export const BATCH_SIZE = 'month'; // Можно менять на 'year' если хотим