import { BadRequestException } from '@nestjs/common';

export function assertCsvColumns(rows: Record<string, string>[], required: string[]): void {
  if (rows.length === 0) throw new BadRequestException('CSV file is empty');
  const actual = Object.keys(rows[0]);
  const missing = required.filter(c => !actual.includes(c));
  if (missing.length > 0) {
    throw new BadRequestException(
      `Invalid CSV format. Expected columns: ${required.join(', ')}. Got: ${actual.join(', ')}`,
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
