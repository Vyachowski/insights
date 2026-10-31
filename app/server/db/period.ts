import { sql } from 'drizzle-orm'

import type { SQL } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'

export interface Period {
  start: Date
  end: Date
}

// DATE-as-text columns compare lexicographically ('YYYY-MM-DD' sorts
// correctly); timestamp columns are integer epoch-ms comparisons.
const toUtcDate = (d: Date) => d.toISOString().slice(0, 10)

export const betweenDates = (column: AnySQLiteColumn, { start, end }: Period): SQL =>
  sql`${column} >= ${toUtcDate(start)} AND ${column} <= ${toUtcDate(end)}`

export const betweenInstants = (column: AnySQLiteColumn, { start, end }: Period): SQL =>
  sql`${column} >= ${start.getTime()} AND ${column} <= ${end.getTime()}`
