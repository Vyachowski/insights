import * as argon2 from 'argon2'
import { z } from 'zod'

import { db } from './db'
import { env } from './env'
import { assertCsvColumns, fetchUrlToBuffer, parseCsvBuffer } from './imports/csv'
import { cities, sites, users } from './schema'
import { getObject, isStorageConfigured } from './storage'

const emptyToNull = (value: string) => (value === '' ? null : value)

const CITY_CSV_COLUMNS = ['id', 'code', 'slug', 'name', 'population']

const cityRowSchema = z.object({
  id: z.coerce.number().int().positive(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  population: z.coerce.number().int().nonnegative(),
})

const SITE_CSV_COLUMNS = [
  'id',
  'cityId',
  'name',
  'group',
  'url',
  'yandexCounterId',
  'googleCounterId',
  'yandexTagManagerId',
  'googleTagManagerId',
]

const siteRowSchema = z.object({
  id: z.coerce.number().int().positive(),
  cityId: z.coerce.number().int().positive(),
  name: z.string().transform(emptyToNull),
  group: z.string().transform(emptyToNull),
  url: z.url(),
  yandexCounterId: z.string().min(1),
  googleCounterId: z.string().transform(emptyToNull),
  yandexTagManagerId: z.string().transform(emptyToNull),
  googleTagManagerId: z.string().transform(emptyToNull),
})

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
  if ((await db.$count(users)) > 0) return 'skipped (table not empty)'

  const admin = readUserConfig('ADMIN', 'ADMIN')
  const user = readUserConfig('USER', 'USER')
  if (!admin || !user) return 'skipped (ADMIN_*/USER_* env vars not set)'

  const values = await Promise.all(
    [admin, user].map(async u => ({
      ...u,
      password: await argon2.hash(u.password),
    })),
  )
  const inserted = await db.insert(users).values(values).returning()
  return `created ${inserted.length} users`
}

async function bootstrapCities(): Promise<string> {
  if ((await db.$count(cities)) > 0) return 'skipped (table not empty)'

  const rows = await fetchRows('seed/cities.csv', env.CITIES_CSV_URL, CITY_CSV_COLUMNS)
  if (!rows) return 'skipped (no CSV source configured)'
  const values = rows.map(row => cityRowSchema.parse(row))
  const inserted = await db.insert(cities).values(values).returning()
  return `created ${inserted.length} cities`
}

async function bootstrapSites(): Promise<string> {
  if ((await db.$count(sites)) > 0) return 'skipped (table not empty)'
  if ((await db.$count(cities)) === 0) return 'skipped (no cities to reference)'

  const rows = await fetchRows('seed/sites.csv', env.SITES_CSV_URL, SITE_CSV_COLUMNS)
  if (!rows) return 'skipped (no CSV source configured)'
  const values = rows.map(row => siteRowSchema.parse(row))
  const inserted = await db.insert(sites).values(values).returning()
  return `created ${inserted.length} sites`
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
