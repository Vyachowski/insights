import type { SiteMetric } from "@/types";
import fs from "fs/promises";
import path from "path";

/**
 * CSV column headers for site metrics
 */
const CSV_HEADERS = [
  "siteId",
  "date",
  "yandexUsers",
  "googleUsers",
  "otherUsers",
  "visitDurationYandexInSec",
  "visitDurationGoogleInSec",
  "visitDurationOtherInSec",
  "bounceYandex",
  "bounceGoogle",
  "bounceOther",
  "leadsYandex",
  "leadsGoogle",
  "leadsOther",
] as const;

/**
 * Escape CSV value
 */
function escapeCSVValue(value: string | number): string {
  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Format metric row as CSV line
 */
function formatMetricRowAsCSV(row: Omit<SiteMetric, 'id'>): string {
  const values = [
    row.siteId,
    row.date.toISOString(),
    row.yandexUsers,
    row.googleUsers,
    row.otherUsers,
    row.visitDurationYandexInSec,
    row.visitDurationGoogleInSec,
    row.visitDurationOtherInSec,
    row.bounceYandex,
    row.bounceGoogle,
    row.bounceOther,
    row.leadsYandex,
    row.leadsGoogle,
    row.leadsOther,
  ];

  return values.map(escapeCSVValue).join(",");
}

/**
 * Append metrics to CSV file
 *
 * Note: Appends to existing file or creates new one with headers
 */
export async function appendMetricsToCSV(
  filePath: string,
  siteId: number,
  metrics: Omit<SiteMetric, 'id'>[],
): Promise<void> {
  if (metrics.length === 0) {
    console.log(`No metrics to write for site ${siteId}`);
    return;
  }

  // Ensure directory exists
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  // Check if file exists
  let fileExists = false;
  try {
    await fs.access(filePath);
    fileExists = true;
  } catch {
    fileExists = false;
  }

  // Prepare CSV content
  const lines: string[] = [];

  // Add header if file doesn't exist
  if (!fileExists) {
    lines.push(CSV_HEADERS.join(","));
  }

  // Add data rows
  const siteMetrics = metrics.map((m) => ({
    site_id: siteId,
    ...m,
  }));

  siteMetrics.forEach((row) => {
    lines.push(formatMetricRowAsCSV(row));
  });

  // Append to file
  const content = lines.join("\n") + "\n";
  await fs.appendFile(filePath, content, "utf-8");

  console.log(`✅ Wrote ${metrics.length} metric rows for site ${siteId}`);
}

/**
 * Clear/initialize CSV file with headers
 */
export async function initializeCSVFile(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  const headerLine = CSV_HEADERS.join(",") + "\n";
  await fs.writeFile(filePath, headerLine, "utf-8");

  console.log(`📄 Initialized CSV file: ${filePath}`);
}
