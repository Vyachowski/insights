import { BadRequestException } from '@nestjs/common';
import { parse } from 'csv-parse/sync';

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true,
} as const;

export function parseCsvBuffer(buffer: Buffer): Record<string, string>[] {
  return parse(buffer, CSV_PARSE_OPTIONS);
}

export async function fetchUrlToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok)
    throw new BadRequestException(`Failed to fetch URL: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Extra columns are allowed (real exports carry more than we consume);
// only missing required columns reject the file.
export function assertCsvColumns(
  rows: Record<string, string>[],
  required: string[],
): void {
  if (rows.length === 0) throw new BadRequestException('CSV file is empty');
  const actual = Object.keys(rows[0]);
  const missing = required.filter((c) => !actual.includes(c));
  if (missing.length > 0) {
    throw new BadRequestException(
      `Invalid CSV format. Missing columns: ${missing.join(', ')}. Got: ${actual.join(', ')}`,
    );
  }
}

export function assertSkipRate(created: number, skipped: number): void {
  const total = created + skipped;
  if (total > 0 && skipped / total > 0.5) {
    throw new BadRequestException(
      `Too many invalid rows: ${skipped} of ${total} could not be imported. Check the file format.`,
    );
  }
}
