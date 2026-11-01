import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from '@/server/db/client'

const { startAutoChargeScheduler, stopAutoChargeScheduler } = await import('./auto-charges')

const HOUR_MS = 60 * 60 * 1000

beforeEach(() => {
  vi.useFakeTimers({ now: new Date('2026-10-29T09:00:00Z'), toFake: ['Date', 'setInterval', 'clearInterval'] })
  vi.spyOn(console, 'log').mockImplementation(() => undefined)
  sqlite.exec(
    'DELETE FROM charge_schedules; DELETE FROM phone_numbers; DELETE FROM expenses; DELETE FROM sites; DELETE FROM cities;',
  )
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'VOL', 'volgograd', 'Волгоград', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://volgograd.example.com/', '111', 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO phone_numbers (provider, provider_number_id, site_id, created_at, updated_at) VALUES ('gudok', '1', 5, 0, 0);",
  )
  sqlite.exec(
    'INSERT INTO charge_schedules (provider, provider_number_id, enabled, next_date, amount, created_at, updated_at) '
    + "VALUES ('gudok', '1', 1, '2026-10-29', 87000, 0, 0);",
  )
})

afterEach(() => {
  stopAutoChargeScheduler()
  sqlite.exec('DROP TRIGGER IF EXISTS fail_insert')
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const expenseDates = () => (sqlite.prepare('SELECT date FROM expenses ORDER BY date').all() as { date: string }[])
  .map(row => row.date)

const breakInserts = () => sqlite.exec(
  "CREATE TRIGGER fail_insert BEFORE INSERT ON expenses BEGIN SELECT RAISE(ABORT, 'disk full'); END;",
)

describe('auto charge scheduler', () => {
  it('checks at start and logs the result', () => {
    startAutoChargeScheduler()

    expect(expenseDates()).toEqual(['2026-10-29'])
    expect(console.log).toHaveBeenCalledWith('[auto-charges] schedules checked: 1, estimates written: 1')
  })

  it('checks again every hour', async () => {
    startAutoChargeScheduler()

    vi.setSystemTime('2026-11-28T09:00:00Z')
    await vi.advanceTimersByTimeAsync(HOUR_MS)

    expect(expenseDates()).toEqual(['2026-10-29', '2026-11-28'])
  })

  it('logs a failure, keeps running and retries on the next tick', async () => {
    const failed = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    breakInserts()

    expect(() => startAutoChargeScheduler()).not.toThrow()

    expect(failed).toHaveBeenCalledWith('[auto-charges] check failed: disk full (retrying next tick)')
    expect(expenseDates()).toEqual([])
    expect(vi.getTimerCount()).toBe(1)

    sqlite.exec('DROP TRIGGER fail_insert')
    await vi.advanceTimersByTimeAsync(HOUR_MS)

    expect(expenseDates()).toEqual(['2026-10-29'])
  })

  it('checks nothing after stop', async () => {
    startAutoChargeScheduler()
    stopAutoChargeScheduler()

    vi.setSystemTime('2026-11-28T09:00:00Z')
    await vi.advanceTimersByTimeAsync(HOUR_MS)

    expect(vi.getTimerCount()).toBe(0)
    expect(expenseDates()).toEqual(['2026-10-29'])
  })

  it('stop is safe before start and when repeated', () => {
    expect(() => {
      stopAutoChargeScheduler()
      stopAutoChargeScheduler()
    }).not.toThrow()
  })
})
