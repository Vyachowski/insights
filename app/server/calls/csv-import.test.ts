import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import * as schema from '@/server/schema'
import { applyMigrations } from '@/server/test-migrations'

// Real in-memory SQLite built from the committed migrations, shared with the
// module under test via the db mock below.
const sqlite = new Database(':memory:')
const testDb = drizzle(sqlite, { schema })

vi.mock('@/server/db', () => ({ db: testDb }))

const { CsvValidationError, importers } = await import('@/server/imports')
const { parseCsvBuffer } = await import('@/server/imports/csv')
const { ingestGudokCall } = await import('./gudok-webhook')

const HEADER = 'Дата,Кто звонил,№,Проект,Куда звонил,Класс'

function csv(...lines: string[]) {
  return Buffer.from([HEADER, ...lines].join('\n'))
}

const line = ({ date = '26.07.26 13:00', src = '79111111111', number = '1', channel = 'Самара' } = {}) =>
  `${date},${src},${number},самара,${channel},Спам`

function rows() {
  return sqlite.prepare('SELECT * FROM calls ORDER BY id').all() as Record<string, unknown>[]
}

function storeWebhookCall(date: string) {
  return ingestGudokCall({
    id: 1001,
    project_id: 7,
    adv_channel_id: '4635',
    adv_channel_name: 'Самара',
    src: '79111111111',
    billsec: 30,
    callstatus: 'ANSWERED',
    region: 'Самарская область',
    date,
    call_number: 1,
  })
}

function disputedRows(disputedCsv: string | null | undefined) {
  return parseCsvBuffer(Buffer.from(disputedCsv ?? ''))
}

beforeAll(() => {
  applyMigrations(sqlite)
})

beforeEach(() => {
  sqlite.exec('DELETE FROM calls; DELETE FROM phone_numbers; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'SAM', 'samara', 'Самара', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, gudok_project_id, created_at, updated_at) VALUES (5, 1, 'https://samara.example.com/', '111', 7, 0, 0), (6, 1, 'https://other.example.com/', '222', 8, 0, 0);",
  )
  sqlite.exec(
    `INSERT INTO phone_numbers (provider, provider_number_id, site_id, name, created_at, updated_at) VALUES
      ('gudok', '4635', 5, 'Самара', 0, 0),
      ('gudok', 'csv:ses-samara', 5, 'СЭС – Самара', 0, 0),
      ('gudok', '9000', NULL, 'Без сайта', 0, 0),
      ('gudok', '9001', 5, 'Двойник', 0, 0),
      ('gudok', '9002', 6, 'Двойник', 0, 0);`,
  )
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('calls CSV import', () => {
  it('writes a new row with the whole CSV row in raw', async () => {
    const result = await importers.calls(csv(line()))

    expect(result).toEqual({ created: 1, skipped: 0, disputed: 0, disputedCsv: null })
    const [row] = rows()
    expect(row).toMatchObject({
      site_id: 5,
      provider: 'gudok',
      provider_number_id: '4635',
      provider_call_id: null,
      src: '79111111111',
      call_number: 1,
      callstatus: null,
      billsec: null,
      region: null,
      source: 'csv',
    })
    expect(JSON.parse(row.raw as string)).toEqual({
      'Дата': '26.07.26 13:00',
      'Кто звонил': '79111111111',
      '№': '1',
      'Проект': 'самара',
      'Куда звонил': 'Самара',
      'Класс': 'Спам',
    })
  })

  it('finds a number with a temporary ID by its name', async () => {
    await importers.calls(csv(line({ channel: 'СЭС – Самара' })))

    expect(rows()[0]).toMatchObject({ site_id: 5, provider_number_id: 'csv:ses-samara' })
  })

  it.each(['UTC', 'Asia/Vladivostok', 'America/New_York'])('reads time as Moscow on a %s server', async zone => {
    vi.stubEnv('TZ', zone)
    await importers.calls(csv(line({ date: '26.07.26 13:05' })))

    expect(rows()[0].date).toBe(Date.parse('2026-07-26T10:05:00Z'))
  })

  it('skips a row on the same minute and leaves the webhook row unchanged', async () => {
    await storeWebhookCall('2026-07-26T10:00:59Z')
    const before = rows()

    const result = await importers.calls(csv(line()))

    expect(result).toMatchObject({ created: 0, skipped: 1, disputed: 0 })
    expect(rows()).toEqual(before)
  })

  it('disputes a row one minute away from the stored call', async () => {
    await storeWebhookCall('2026-07-26T10:00:59Z')
    const before = rows()

    const result = await importers.calls(csv(line({ date: '26.07.26 13:01' })))

    expect(result).toMatchObject({ created: 0, skipped: 0, disputed: 1 })
    expect(rows()).toEqual(before)
  })

  it('writes a row of another caller, call number or site as new', async () => {
    await storeWebhookCall('2026-07-26T10:00:00Z')
    sqlite.exec("UPDATE phone_numbers SET site_id = 6 WHERE provider_number_id = 'csv:ses-samara'")

    const result = await importers.calls(csv(
      line({ src: '79222222222' }),
      line({ number: '2' }),
      line({ channel: 'СЭС – Самара' }),
    ))

    expect(result).toMatchObject({ created: 3, skipped: 0, disputed: 0 })
  })

  it('disputes rows whose number gives no single site', async () => {
    const result = await importers.calls(csv(
      line({ channel: 'Нет такого' }),
      line({ channel: 'Без сайта' }),
      line({ channel: 'Двойник' }),
    ))

    expect(result).toMatchObject({ created: 0, skipped: 0, disputed: 3 })
    expect(disputedRows(result.disputedCsv).map(row => row['Причина'])).toEqual([
      'Неизвестный номер',
      'У номера нет сайта',
      'Имя есть у нескольких номеров',
    ])
    expect(rows()).toEqual([])
  })

  it('returns disputed rows as a CSV with every source column', async () => {
    const result = await importers.calls(csv(
      line({ channel: 'Нет такого' }),
      '26.07.26 13:00,79111111111,1,"самара, ""юг""",Другой,',
      line(),
    ))

    expect(result.disputedCsv?.startsWith('﻿')).toBe(true)
    expect(disputedRows(result.disputedCsv)).toEqual([
      {
        'Дата': '26.07.26 13:00',
        'Кто звонил': '79111111111',
        '№': '1',
        'Проект': 'самара',
        'Куда звонил': 'Нет такого',
        'Класс': 'Спам',
        'Причина': 'Неизвестный номер',
      },
      {
        'Дата': '26.07.26 13:00',
        'Кто звонил': '79111111111',
        '№': '1',
        'Проект': 'самара, "юг"',
        'Куда звонил': 'Другой',
        'Класс': '',
        'Причина': 'Неизвестный номер',
      },
    ])
  })

  it('treats repeated rows inside one file like stored ones', async () => {
    const result = await importers.calls(csv(line(), line(), line({ date: '26.07.26 13:01' })))

    expect(result).toMatchObject({ created: 1, skipped: 1, disputed: 1 })
    expect(rows()).toHaveLength(1)
  })

  it('writes nothing new when the same file is uploaded again', async () => {
    const file = csv(line(), line({ src: '79222222222' }), line({ channel: 'Нет такого' }))
    await importers.calls(file)
    const before = rows()

    const result = await importers.calls(file)

    expect(result).toMatchObject({ created: 0, skipped: 2, disputed: 1 })
    expect(rows()).toEqual(before)
  })

  it('compares against rows past the first chunk', async () => {
    const lines = Array.from({ length: 1001 }, (_, i) => line({ number: String(i + 1) }))

    const result = await importers.calls(csv(...lines, line({ number: '1001', date: '26.07.26 13:01' })))

    expect(result).toMatchObject({ created: 1001, skipped: 0, disputed: 1 })
  })

  it('hands back an invalid row among valid ones', async () => {
    const result = await importers.calls(csv(
      line(),
      line({ src: '79222222222' }),
      line({ src: '79333333333', date: '31.02.26 13:00' }),
    ))

    expect(result).toMatchObject({ created: 2, disputed: 1 })
    expect(disputedRows(result.disputedCsv)[0]['Причина']).toBe('Неверная строка')
  })

  it('rejects a mostly invalid file without writing', async () => {
    const result = importers.calls(csv(
      line(),
      line({ date: 'вчера' }),
      line({ number: '' }),
    ))

    await expect(result).rejects.toBeInstanceOf(CsvValidationError)
    expect(rows()).toEqual([])
  })

  it('rejects a file without the required columns', async () => {
    await expect(importers.calls(Buffer.from('a,b\n1,2')))
      .rejects.toThrow('Missing columns')
  })
})
