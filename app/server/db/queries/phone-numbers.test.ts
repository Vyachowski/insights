import { beforeEach, describe, expect, it } from 'vitest'

import { sqlite } from '@/server/db/client'

const { listNumbersWithSchedules } = await import('./phone-numbers')

beforeEach(() => {
  sqlite.exec('DELETE FROM charge_schedules; DELETE FROM phone_numbers; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0), (6, 1, 'https://volzhsky.example.com/', '222', 0, 0);",
  )
})

function seedNumber(id: string, siteId: number | null) {
  sqlite.prepare(
    "INSERT INTO phone_numbers (provider, provider_number_id, number, name, site_id, created_at, updated_at) VALUES ('gudok', ?, ?, ?, ?, 0, 0)",
  ).run(id, `7${id}`, `Номер ${id}`, siteId)
}

function seedSchedule(id: string) {
  sqlite.prepare(
    'INSERT INTO charge_schedules (provider, provider_number_id, enabled, next_date, amount, created_at, updated_at) '
    + "VALUES ('gudok', ?, 1, '2026-11-26', 87000, 0, 0)",
  ).run(id)
}

describe('listNumbersWithSchedules', () => {
  it('joins a number to its schedule, in kopecks', async () => {
    seedNumber('1', 5)
    seedSchedule('1')

    expect(await listNumbersWithSchedules()).toEqual([{
      provider: 'gudok',
      providerNumberId: '1',
      number: '71',
      name: 'Номер 1',
      siteId: 5,
      enabled: true,
      nextDate: '2026-11-26',
      amount: 87000,
    }])
  })

  it('lists a number with no schedule, with the schedule fields empty', async () => {
    seedNumber('1', 5)

    expect(await listNumbersWithSchedules()).toMatchObject([
      { providerNumberId: '1', siteId: 5, enabled: null, nextDate: null, amount: null },
    ])
  })

  it('lists a number with no site, with the site empty', async () => {
    seedNumber('1', null)

    expect(await listNumbersWithSchedules()).toMatchObject([{ providerNumberId: '1', siteId: null }])
  })

  it('orders by site, with numbers that have no site last', async () => {
    seedNumber('1', null)
    seedNumber('2', 6)
    seedNumber('3', 5)

    const rows = await listNumbersWithSchedules()
    expect(rows.map(row => row.providerNumberId)).toEqual(['3', '2', '1'])
  })
})
