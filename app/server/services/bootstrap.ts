import * as argon2 from 'argon2'

import { fetchUrlToBuffer } from './fetch-file'

import { assertCsvColumns, parseCsvBuffer } from '@/server/core/csv'
import { CITY_CSV_COLUMNS, cityRowSchema, SITE_CSV_COLUMNS, siteRowSchema } from '@/server/core/seed-rows'
import { countCities, insertCities } from '@/server/db/queries/cities'
import { countSites, insertSites } from '@/server/db/queries/sites'
import { countUsers, insertUsers } from '@/server/db/queries/users'
import { env } from '@/server/env'
import { getObject, isStorageConfigured } from '@/server/storage'

export async function bootstrap(): Promise<void> {
  await runStep('users', bootstrapUsers)
  await runStep('cities', bootstrapCities)
  await runStep('sites', bootstrapSites)
}

async function runStep(step: string, fn: () => Promise<string>): Promise<void> {
  try {
    console.log(`[bootstrap] ${step}: ${await fn()}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[bootstrap] ${step} failed: ${message}`)
  }
}

function readUserConfig(prefix: 'ADMIN' | 'USER', role: 'ADMIN' | 'USER') {
  const email = env[`${prefix}_EMAIL`]
  const password = env[`${prefix}_PASSWORD`]
  if (!email || !password) return null
  return {
    email,
    password,
    role,
    firstName: env[`${prefix}_NAME`] ?? null,
    lastName: env[`${prefix}_LASTNAME`] ?? null,
  }
}

async function bootstrapUsers(): Promise<string> {
  if ((await countUsers()) > 0) return 'skipped (table not empty)'

  const admin = readUserConfig('ADMIN', 'ADMIN')
  const user = readUserConfig('USER', 'USER')
  if (!admin || !user) return 'skipped (ADMIN_*/USER_* env vars not set)'

  const values = await Promise.all(
    [admin, user].map(async u => ({
      ...u,
      password: await argon2.hash(u.password),
    })),
  )
  return `created ${await insertUsers(values)} users`
}

async function bootstrapCities(): Promise<string> {
  if ((await countCities()) > 0) return 'skipped (table not empty)'

  const rows = await fetchRows('seed/cities.csv', env.CITIES_CSV_URL, CITY_CSV_COLUMNS)
  if (!rows) return 'skipped (no CSV source configured)'
  const values = rows.map(row => cityRowSchema.parse(row))
  return `created ${await insertCities(values)} cities`
}

async function bootstrapSites(): Promise<string> {
  if ((await countSites()) > 0) return 'skipped (table not empty)'
  if ((await countCities()) === 0) return 'skipped (no cities to reference)'

  const rows = await fetchRows('seed/sites.csv', env.SITES_CSV_URL, SITE_CSV_COLUMNS)
  if (!rows) return 'skipped (no CSV source configured)'
  const values = rows.map(row => siteRowSchema.parse(row))
  return `created ${await insertSites(values)} sites`
}

// Source resolution: bucket (when configured) → plain URL → null (skip).
// A bucket failure falls back to the URL so misconfiguration degrades to
// the previous behavior, not below it.
async function fetchRows(
  bucketKey: string,
  fallbackUrl: string | undefined,
  columns: string[],
): Promise<Record<string, string>[] | null> {
  let buffer: Buffer | null = null

  if (isStorageConfigured()) {
    try {
      buffer = await getObject(bucketKey)
      if (!buffer) console.warn(`[bootstrap] bucket object ${bucketKey} not found`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[bootstrap] bucket fetch failed (${message}), falling back to URL`)
    }
  }

  if (!buffer && fallbackUrl) buffer = await fetchUrlToBuffer(fallbackUrl)
  if (!buffer) return null

  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, columns)
  return rows
}
