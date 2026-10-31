import { db } from './client'

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** better-sqlite3 runs transactions synchronously: `fn` must not be async. */
export function transaction<T>(fn: (tx: Tx) => T): T {
  return db.transaction(fn)
}
