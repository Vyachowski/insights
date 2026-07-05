import * as argon2 from 'argon2'
import { sql } from 'drizzle-orm'
import { z } from 'zod'

import { db } from './db'
import { env } from './env'
import { assertCsvColumns, fetchUrlToBuffer, parseCsvBuffer } from './imports/csv'
import { cities, sites, users } from './schema'

const emptyToNull = (value: string) => (value === '' ? null : value)

export const CITY_CSV_COLUMNS = ['id', 'code', 'slug', 'name', 'population']

export const cityRowSchema = z.object({
  id: z.coerce.number().int().positive(),
  code: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  population: z.coerce.number().int().nonnegative(),
})

export const SITE_CSV_COLUMNS = [
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

export const siteRowSchema = z.object({
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
  const url = env.CITIES_CSV_URL
  if (!url) return 'skipped (CITIES_CSV_URL not set)'

  const rows = await fetchRows(url, CITY_CSV_COLUMNS)
  const values = rows.map(row => cityRowSchema.parse(row))
  const inserted = await db.insert(cities).values(values).returning()
  await resetIdSequence('cities')
  return `created ${inserted.length} cities`
}

async function bootstrapSites(): Promise<string> {
  if ((await db.$count(sites)) > 0) return 'skipped (table not empty)'
  if ((await db.$count(cities)) === 0) return 'skipped (no cities to reference)'
  const url = env.SITES_CSV_URL
  if (!url) return 'skipped (SITES_CSV_URL not set)'

  const rows = await fetchRows(url, SITE_CSV_COLUMNS)
  const values = rows.map(row => siteRowSchema.parse(row))
  const inserted = await db.insert(sites).values(values).returning()
  await resetIdSequence('sites')
  return `created ${inserted.length} sites`
}

async function fetchRows(
  url: string,
  columns: string[],
): Promise<Record<string, string>[]> {
  const buffer = await fetchUrlToBuffer(url)
  const rows = parseCsvBuffer(buffer)
  assertCsvColumns(rows, columns)
  return rows
}

async function resetIdSequence(table: 'cities' | 'sites'): Promise<void> {
  await db.execute(
    sql`SELECT setval(pg_get_serial_sequence(${table}, 'id'), (SELECT COALESCE(MAX(id), 1) FROM ${sql.identifier(table)}))`,
  )
}
