import fs from "fs/promises";
import path from "path";
import type { MetricRow, SiteMetricRow } from "./site-metrics-schema";

/**
 * CSV column headers for site metrics
 */
const CSV_HEADERS = [
  "site_id",
  "date",
  "yandex_users",
  "google_users",
  "other_users",
  "visit_duration_yandex_in_sec",
  "visit_duration_google_in_sec",
  "visit_duration_other_in_sec",
  "bounce_yandex",
  "bounce_google",
  "bounce_other",
  "leads_yandex",
  "leads_google",
  "leads_other",
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
function formatMetricRowAsCSV(row: SiteMetricRow): string {
  const values = [
    row.site_id,
    row.date,
    row.yandex_users,
    row.google_users,
    row.other_users,
    row.visit_duration_yandex_in_sec,
    row.visit_duration_google_in_sec,
    row.visit_duration_other_in_sec,
    row.bounce_yandex,
    row.bounce_google,
    row.bounce_other,
    row.leads_yandex,
    row.leads_google,
    row.leads_other,
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
  metrics: MetricRow[],
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
  const siteMetrics: SiteMetricRow[] = metrics.map((m) => ({
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
