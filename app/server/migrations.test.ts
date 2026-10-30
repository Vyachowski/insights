import Database from 'better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'

import { applyMigrations } from './test-migrations'

const NEW = '0002_switch_to_new_call_tables'
const DROP = '0003_drop_old_call_tables'
const HOUR = 60 * 60 * 1000
const CSV_DATE = Date.UTC(2026, 5, 1, 12, 0)

let sqlite: Database.Database

function seedSites() {
  sqlite.exec(`
    INSERT INTO cities (id, code, slug, name, population, created_at, updated_at)
      VALUES (1, 'SAM', 'samara', 'Самара', 100, 0, 0);
    INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at)
      VALUES (1, 1, 'https://samara.example.com/', '1', 0, 0),
             (2, 1, 'https://tolyatti.example.com/', '2', 0, 0);
  `)
}

let nextCsvId = 1
function insertCsv(row: { site?: number; src?: string; name: string; date?: number; callNumber?: number }) {
  sqlite
    .prepare(`INSERT INTO call_imports (id, site_id, date, src, region, call_number, class, project_title, adv_channel_name, billsec, imported_at)
      VALUES (?, ?, ?, ?, 'Самарская обл.', ?, 'Спам', 'самара', ?, 0, 123)`)
    .run(nextCsvId++, row.site ?? 1, row.date ?? CSV_DATE, row.src ?? '79990000001', row.callNumber ?? 1, row.name)
}

function insertWebhook(row: { id: number; src: string; date: number; callNumber: number }) {
  sqlite
    .prepare(`INSERT INTO calls (site_id, gudok_id, project_id, project_title, dst, adv_channel_id, adv_channel_name, src, duration, billsec, callstatus, date, region, call_number, audio, raw, created_at, updated_at)
      VALUES (1, ?, 8171, 'Самара', '78463794173', '4635', 'Самара', ?, 40, 30, 'ANSWERED', ?, 'Самарская обл.', ?, '', '{"id":1}', 5, 6)`)
    .run(row.id, row.src, row.date, row.callNumber)
}

const newCalls = () =>
  sqlite.prepare('SELECT * FROM calls ORDER BY id').all() as Record<string, unknown>[]

beforeEach(() => {
  nextCsvId = 1
  sqlite = new Database(':memory:')
  applyMigrations(sqlite, { to: '0001_common_shard' })
})

describe(NEW, () => {
  it('runs on a fresh empty database', () => {
    applyMigrations(sqlite, { from: NEW, to: NEW })
    expect(newCalls()).toEqual([])
    expect(sqlite.prepare('SELECT count(*) AS c FROM phone_numbers').get()).toEqual({ c: 0 })
  })

  it('leaves no helper tables and frees the old index names', () => {
    seedSites()
    applyMigrations(sqlite, { from: NEW, to: NEW })

    const tables = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '\\_\\_calls%' ESCAPE '\\'")
      .all()
    expect(tables).toEqual([])

    const indexes = sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name IN ('calls_old', 'call_imports_old') AND sql IS NOT NULL")
      .all()
    expect(indexes).toEqual([])
  })

  it('seeds numbers and projects for existing sites only', () => {
    seedSites()
    applyMigrations(sqlite, { from: NEW, to: NEW })

    expect(sqlite.prepare('SELECT id, gudok_project_id AS p FROM sites ORDER BY id').all()).toEqual([
      { id: 1, p: 8171 },
      { id: 2, p: 8184 },
    ])
    expect(
      sqlite.prepare('SELECT DISTINCT site_id AS s FROM phone_numbers ORDER BY s').all(),
    ).toEqual([{ s: 1 }, { s: 2 }])
  })

  it('moves CSV history with the shift, the map, raw and null billsec', () => {
    seedSites()
    insertCsv({ name: 'Самара' })
    applyMigrations(sqlite, { from: NEW, to: NEW })

    const [row] = newCalls()
    expect(row).toMatchObject({
      site_id: 1,
      provider: 'gudok',
      provider_number_id: '4635',
      provider_call_id: null,
      date: CSV_DATE - 3 * HOUR,
      billsec: null,
      callstatus: null,
      region: null,
      source: 'csv',
      created_at: 123,
    })
    expect(JSON.parse(row.raw as string)).toMatchObject({
      class: 'Спам',
      region: 'Самарская обл.',
      billsec: 0,
      adv_channel_name: 'Самара',
      date: CSV_DATE,
    })
  })

  it('moves webhook rows unchanged', () => {
    seedSites()
    insertWebhook({ id: 77, src: '79990000002', date: CSV_DATE + 25_000, callNumber: 1 })
    applyMigrations(sqlite, { from: NEW, to: NEW })

    expect(newCalls()[0]).toMatchObject({
      site_id: 1,
      provider_number_id: '4635',
      provider_call_id: '77',
      date: CSV_DATE + 25_000,
      billsec: 30,
      callstatus: 'ANSWERED',
      source: 'webhook',
      raw: '{"id":1}',
      created_at: 5,
    })
  })

  it('links a removed channel to its temporary number', () => {
    seedSites()
    insertCsv({ name: 'СЭС – Самара' })
    applyMigrations(sqlite, { from: NEW, to: NEW })
    expect(newCalls()[0].provider_number_id).toBe('csv:ses-samara')
  })

  it('leaves out the excluded channel', () => {
    seedSites()
    insertCsv({ name: 'Слава – Питер' })
    insertCsv({ name: 'Самара', src: '79990000003' })
    applyMigrations(sqlite, { from: NEW, to: NEW })
    expect(newCalls().map(row => row.src)).toEqual(['79990000003'])
  })

  it('merges a call present in both sources into the webhook row', () => {
    seedSites()
    insertCsv({ name: 'Самара', date: CSV_DATE, callNumber: 2 })
    insertWebhook({ id: 77, src: '79990000001', date: CSV_DATE - 3 * HOUR + 25_000, callNumber: 2 })
    applyMigrations(sqlite, { from: NEW, to: NEW })

    const rows = newCalls()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ source: 'webhook', provider_call_id: '77' })
  })

  it('keeps calls of one caller a different minute apart', () => {
    seedSites()
    insertCsv({ name: 'Самара', date: CSV_DATE, callNumber: 2 })
    insertWebhook({ id: 77, src: '79990000001', date: CSV_DATE - 3 * HOUR + 60_000, callNumber: 2 })
    applyMigrations(sqlite, { from: NEW, to: NEW })
    expect(newCalls()).toHaveLength(2)
  })

  it('aborts on an unmapped name and leaves the database as it was', () => {
    seedSites()
    insertCsv({ name: 'Неизвестный канал' })

    expect(() => applyMigrations(sqlite, { from: NEW, to: NEW })).toThrow(/no_unmapped_channel_names/)
    expect(sqlite.prepare('SELECT count(*) AS c FROM call_imports').get()).toEqual({ c: 1 })
    expect(
      sqlite.prepare("SELECT name FROM sqlite_master WHERE name IN ('phone_numbers', 'calls_old')").all(),
    ).toEqual([])
  })

  it('aborts on a row count mismatch', () => {
    seedSites()
    insertCsv({ name: 'Самара' })
    // A broken copy step: the CSV rows never reach the new table
    const patch = (sql: string) => sql.replace(
      'WHERE c.`adv_channel_name` <> \'Слава – Питер\'\n\tAND c.`id` NOT IN',
      'WHERE 0 AND c.`id` NOT IN',
    )

    expect(() => applyMigrations(sqlite, { from: NEW, to: NEW, patch })).toThrow(/row_count_matches/)
    expect(sqlite.prepare('SELECT count(*) AS c FROM call_imports').get()).toEqual({ c: 1 })
  })
})

describe(DROP, () => {
  const oldTables = () =>
    sqlite.prepare("SELECT name FROM sqlite_master WHERE name LIKE '%\\_old' ESCAPE '\\' ORDER BY name").all()
  const numbers = () =>
    sqlite.prepare('SELECT * FROM phone_numbers ORDER BY provider, provider_number_id').all()

  it('runs on a fresh empty database', () => {
    applyMigrations(sqlite, { from: NEW })
    expect(oldTables()).toEqual([])
  })

  it('drops the old tables and leaves calls and numbers as they were', () => {
    seedSites()
    insertCsv({ name: 'Самара' })
    insertWebhook({ id: 77, src: '79990000002', date: CSV_DATE + 25_000, callNumber: 1 })
    applyMigrations(sqlite, { from: NEW, to: NEW })
    expect(oldTables()).toEqual([{ name: 'call_imports_old' }, { name: 'calls_old' }])
    const callsBefore = newCalls()
    const numbersBefore = numbers()
    expect(callsBefore).toHaveLength(2)

    applyMigrations(sqlite, { from: DROP })

    expect(oldTables()).toEqual([])
    expect(newCalls()).toEqual(callsBefore)
    expect(numbers()).toEqual(numbersBefore)
  })
})
