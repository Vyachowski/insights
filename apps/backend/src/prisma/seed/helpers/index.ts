import { ImportResult, SiteWithCity } from '../types';

export function formatImportResult(
  name: string,
  result: ImportResult<null | SiteWithCity[]>,
): string {
  return `✅ ${name}: Inserted ${result.inserted}, Skipped ${result.skipped}${result.errors.length > 0 ? `, Errors ${result.errors.length}` : ''}`;
}
