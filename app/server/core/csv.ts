import { parse } from 'csv-parse/sync'

/** Validation failure that should surface as a readable message, not a crash */
export class CsvValidationError extends Error {}

export type CsvRow = Record<string, string>

const CSV_PARSE_OPTIONS = {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true,
} as const

export function parseCsvBuffer(buffer: Buffer): CsvRow[] {
  return parse(buffer, CSV_PARSE_OPTIONS)
}

// Extra columns are allowed (real exports carry more than we consume);
// only missing required columns reject the file.
export function assertCsvColumns(
  rows: CsvRow[],
  required: string[],
): void {
  if (rows.length === 0) throw new CsvValidationError('CSV file is empty')
  const actual = Object.keys(rows[0])
  const missing = required.filter(c => !actual.includes(c))
  if (missing.length > 0) {
    throw new CsvValidationError(
      `Invalid CSV format. Missing columns: ${missing.join(', ')}. Got: ${actual.join(', ')}`,
    )
  }
}

export function assertSkipRate(created: number, skipped: number): void {
  const total = created + skipped
  if (total > 0 && skipped / total > 0.5) {
    throw new CsvValidationError(
      `Too many invalid rows: ${skipped} of ${total} could not be imported. Check the file format.`,
    )
  }
}
