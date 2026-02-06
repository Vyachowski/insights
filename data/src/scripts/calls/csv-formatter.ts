import type { CallRaw } from "./calls-raw-schema";

/**
 * CSV column headers for calls_raw table
 */
export const CALLS_RAW_CSV_HEADERS = [
  "site_id",
  "date",
  "src",
  "region",
  "call_number",
  "class",
  "project_title",
  "adv_channel_name",
  "billsec",
  "comment",
  "redirect_number",
  "source",
  "imported_at",
] as const;

/**
 * Escape CSV value (wrap in quotes if contains comma, quote, or newline)
 */
function escapeCSVValue(value: string | number | null): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
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
 * Format CallRaw object as CSV row
 */
export function formatCallRawAsCSV(call: CallRaw): string {
  const values = [
    call.site_id,
    call.date,
    call.src,
    call.region,
    call.call_number,
    call.class,
    call.project_title,
    call.adv_channel_name,
    call.billsec,
    call.comment,
    call.redirect_number,
    call.source,
    call.imported_at,
  ];

  return values.map(escapeCSVValue).join(",");
}

/**
 * Generate complete CSV content from CallRaw array
 */
export function generateCallsRawCSV(calls: CallRaw[]): string {
  const lines: string[] = [];

  // Header row
  lines.push(CALLS_RAW_CSV_HEADERS.join(","));

  // Data rows
  calls.forEach((call) => {
    lines.push(formatCallRawAsCSV(call));
  });

  return lines.join("\n");
}
