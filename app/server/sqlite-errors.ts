/** True when a better-sqlite3 error is a UNIQUE-constraint violation. */
export function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof Error &&
    'code' in err &&
    (err as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE'
  )
}
