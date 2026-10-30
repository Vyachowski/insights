import fs from 'node:fs'
import path from 'node:path'

import type { Database } from 'better-sqlite3'

const DIR = path.resolve(__dirname, '../../drizzle')

interface Journal {
  entries: { tag: string }[]
}

/**
 * Run the journal's migrations `from` (inclusive) `to` (inclusive) the way
 * drizzle does: statement by statement in one transaction.
 */
export function applyMigrations(
  sqlite: Database,
  { from, to, patch }: { from?: string; to?: string; patch?: (sql: string) => string } = {},
): void {
  const journal = JSON.parse(
    fs.readFileSync(path.join(DIR, 'meta/_journal.json'), 'utf8'),
  ) as Journal
  const tags = journal.entries.map(entry => entry.tag)
  const start = from ? tags.indexOf(from) : 0
  const end = to ? tags.indexOf(to) : tags.length - 1

  sqlite.transaction(() => {
    for (const tag of tags.slice(start, end + 1)) {
      const file = fs.readFileSync(path.join(DIR, `${tag}.sql`), 'utf8')
      const text = patch ? patch(file) : file
      for (const stmt of text.split('--> statement-breakpoint')) {
        sqlite.prepare(stmt).run()
      }
    }
  })()
}
