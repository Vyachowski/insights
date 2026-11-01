import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'

import * as argon2 from 'argon2'
import { addDays, addHours, format, startOfMonth, subMonths } from 'date-fns'

// Shell values beat the env file, so a stray export must not point this at real data
const SANDBOX_DB = path.resolve('data/sandbox.db')
if (path.resolve(process.env.DATABASE_PATH ?? '') !== SANDBOX_DB) {
  throw new Error(`[sandbox] refused: DATABASE_PATH must be ${SANDBOX_DB}`)
}
if (Object.keys(process.env).some(key => key.startsWith('BUCKET_'))) {
  throw new Error('[sandbox] refused: unset BUCKET_* first')
}
for (const suffix of ['', '-wal', '-shm']) fs.rmSync(`${SANDBOX_DB}${suffix}`, { force: true })

// Loaded after the delete, because importing the client opens the file
const { PROVIDER } = await import('@/server/core/gudok-calls')
const { HOSTING_TYPE } = await import('@/server/core/finance')
const { TELEPHONY_TYPE } = await import('@/server/core/gudok-history')
const { toKopecks } = await import('@/server/core/money')
const { runMigrations } = await import('@/server/db/migrate')
const { insertCall } = await import('@/server/db/queries/calls')
const { insertCities, listCities } = await import('@/server/db/queries/cities')
const { upsertExpense } = await import('@/server/db/queries/expenses')
const { upsertMetric } = await import('@/server/db/queries/metrics')
const { createPhoneNumber } = await import('@/server/db/queries/phone-numbers')
const { upsertRevenue } = await import('@/server/db/queries/revenues')
const { insertSites, listSites } = await import('@/server/db/queries/sites')
const { insertUsers } = await import('@/server/db/queries/users')
const { transaction } = await import('@/server/db/transaction')
const { env } = await import('@/server/env')

const MONTHS = 12
const CALLS_PER_MONTH = 5
const CALL_STEP_DAYS = 5

const now = new Date()
const isoDate = (date: Date) => format(date, 'yyyy-MM-dd')
const lastMonths = Array.from({ length: MONTHS }, (_, ago) => subMonths(startOfMonth(now), ago))

// The fixed id keeps a session valid across rebuilds and across copies on localhost
async function seedAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) throw new Error('[sandbox] ADMIN_* not set')
  await insertUsers([{
    id: 'sandbox-admin',
    email: env.ADMIN_EMAIL,
    password: await argon2.hash(env.ADMIN_PASSWORD),
    role: 'ADMIN',
    firstName: env.ADMIN_NAME ?? null,
    lastName: env.ADMIN_LASTNAME ?? null,
  }])
}

async function seedSites() {
  await insertCities([
    { code: 'TST', slug: 'testograd', name: 'Тестоград', population: 500_000 },
    { code: 'PRM', slug: 'primersk', name: 'Примерск', population: 150_000 },
  ])
  const [first, second] = await listCities()
  await insertSites([1, 2, 3].map(n => ({
    cityId: (n === 3 ? second : first).id,
    name: `Сайт ${n}`,
    group: 'Песочница',
    url: `https://site-${n}.sandbox.test`,
    yandexCounterId: `0000000${n}`,
    gudokProjectId: n,
  })))
  return listSites()
}

async function seedSiteMonth(siteId: number, month: Date, age: number) {
  const date = isoDate(month)
  const growth = 1 + (MONTHS - age) / 20
  await upsertRevenue({ date, siteId, amount: toKopecks(Math.round(90_000 * siteId * growth)) })
  await upsertExpense({ date, siteId, type: TELEPHONY_TYPE, amount: toKopecks(4_000 + 500 * siteId + 100 * age) })
  await upsertMetric(siteId, date, {
    yandexUsers: 700 * siteId + 40 * age,
    googleUsers: 300 * siteId + 20 * age,
    otherUsers: 50 * siteId,
    leadsYandex: 20 + age,
    leadsGoogle: 10 + age,
  })
}

// 7000000… is an unassigned range, so no caller here is a real number
const syntheticCall = (siteId: number, age: number, index: number) => ({
  siteId,
  provider: PROVIDER,
  providerNumberId: `sandbox-${siteId}`,
  src: `7000000${siteId}${String(age).padStart(2, '0')}${index}`,
  callNumber: index === CALLS_PER_MONTH - 1 ? 2 : 1,
  date: addHours(addDays(lastMonths[age], index * CALL_STEP_DAYS), 9 + index),
  callstatus: 'ANSWERED',
  billsec: 30 + 10 * index,
  region: 'Тестовый регион',
  source: 'csv',
  raw: JSON.stringify({ synthetic: true }),
})

function seedCalls(siteIds: number[]) {
  const rows = siteIds
    .flatMap(siteId => lastMonths.flatMap((_, age) =>
      Array.from({ length: CALLS_PER_MONTH }, (_, index) => syntheticCall(siteId, age, index))))
    .filter(row => row.date <= now)
  transaction(tx => rows.forEach(row => insertCall(tx, row)))
  return rows.length
}

async function seedFinance(siteIds: number[]) {
  for (const siteId of siteIds) {
    await createPhoneNumber({
      provider: PROVIDER,
      providerNumberId: `sandbox-${siteId}`,
      number: `7000000000${siteId}`,
      siteId,
      name: `Номер сайта ${siteId}`,
    })
    await upsertExpense({
      date: `${now.getFullYear()}-01-01`,
      siteId,
      type: HOSTING_TYPE,
      amount: toKopecks(12_000),
    })
    for (const [age, month] of lastMonths.entries()) await seedSiteMonth(siteId, month, age)
  }
}

runMigrations()
await seedAdmin()
const siteIds = (await seedSites()).map(site => site.id)
await seedFinance(siteIds)
const callCount = seedCalls(siteIds)
console.log(`[sandbox] rebuilt ${env.DATABASE_PATH}: ${siteIds.length} sites, ${MONTHS} months, ${callCount} calls`)
