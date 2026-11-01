import Database from 'better-sqlite3'
import { beforeEach, describe, expect, it } from 'vitest'

import { applyMigrations } from './test-migrations'

const NEW = '0002_switch_to_new_call_tables'
const DROP = '0003_drop_old_call_tables'
const AUTO = '0004_add_auto_charge_storage'
const HOSTING = '0005_add_hostings'
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
    applyMigrations(sqlite, { from: NEW, to: AUTO })
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

    applyMigrations(sqlite, { from: DROP, to: AUTO })

    expect(oldTables()).toEqual([])
    expect(newCalls()).toEqual(callsBefore)
    expect(numbers()).toEqual(numbersBefore)
  })
})

describe(AUTO, () => {
  const count = (table: string) => sqlite.prepare(`SELECT count(*) AS c FROM ${table}`).get()
  const storedExpenses = () =>
    sqlite.prepare('SELECT * FROM expenses ORDER BY id').all() as Record<string, unknown>[]
  const insertSchedule = (numberId = '4635') =>
    sqlite
      .prepare(`INSERT INTO charge_schedules (provider, provider_number_id, next_date, amount, created_at, updated_at)
        VALUES ('gudok', ?, '2026-11-26', 87000, 0, 0)`)
      .run(numberId)

  function migrateWithNumbers() {
    seedSites()
    applyMigrations(sqlite, { from: NEW, to: AUTO })
  }

  it('runs on a fresh empty database', () => {
    applyMigrations(sqlite, { from: NEW, to: AUTO })

    expect(count('expenses')).toEqual({ c: 0 })
    expect(count('charge_schedules')).toEqual({ c: 0 })
    expect(count('reconciliation_runs')).toEqual({ c: 0 })
  })

  it('keeps stored expenses and leaves them real', () => {
    seedSites()
    applyMigrations(sqlite, { from: NEW, to: DROP })
    sqlite.exec(`
      INSERT INTO expenses (site_id, date, amount, type, comment, created_at, updated_at)
        VALUES (1, '2026-07-26', 87000, 'telephony', 'Самара', 5, 6),
               (NULL, '2026-07-27', 150050, 'hosting', NULL, 7, 8);
    `)
    const before = storedExpenses()
    expect(before).toHaveLength(2)

    applyMigrations(sqlite, { from: AUTO, to: AUTO })

    expect(storedExpenses()).toEqual(before.map(row => ({ ...row, is_estimate: 0 })))
  })

  it('seeds no schedule for an existing number', () => {
    migrateWithNumbers()

    expect(count('phone_numbers')).not.toEqual({ c: 0 })
    expect(count('charge_schedules')).toEqual({ c: 0 })
  })

  it('starts a schedule off, every 30 days, with no checked period', () => {
    migrateWithNumbers()
    insertSchedule()

    expect(sqlite.prepare('SELECT * FROM charge_schedules').get()).toMatchObject({
      enabled: 0,
      next_date: '2026-11-26',
      amount: 87000,
      interval_days: 30,
      no_charge_period_end: null,
    })
  })

  it('holds one schedule per number', () => {
    migrateWithNumbers()
    insertSchedule()

    expect(() => insertSchedule()).toThrow(/UNIQUE/)
  })

  it('refuses a schedule for an unknown number', () => {
    migrateWithNumbers()
    sqlite.pragma('foreign_keys = ON')

    expect(() => insertSchedule('unknown')).toThrow(/FOREIGN KEY/)
  })

  it('deletes a schedule with its number and keeps the others', () => {
    migrateWithNumbers()
    sqlite.pragma('foreign_keys = ON')
    insertSchedule()
    insertSchedule('4255')
    expect(count('charge_schedules')).toEqual({ c: 2 })

    sqlite.exec("DELETE FROM phone_numbers WHERE provider = 'gudok' AND provider_number_id = '4635'")

    expect(count('charge_schedules')).toEqual({ c: 1 })
  })

  it('logs a reconciliation run', () => {
    applyMigrations(sqlite, { from: NEW, to: AUTO })
    sqlite.exec(`
      INSERT INTO reconciliation_runs (period_start, period_end, ran_at)
        VALUES ('2026-07-26', '2026-10-31', 123);
    `)

    expect(sqlite.prepare('SELECT * FROM reconciliation_runs').all()).toEqual([
      { id: 1, period_start: '2026-07-26', period_end: '2026-10-31', ran_at: 123 },
    ])
  })
})

describe(HOSTING, () => {
  const all = (query: string) => sqlite.prepare(query).all() as Record<string, unknown>[]
  const storedExpenses = () => all('SELECT * FROM expenses ORDER BY id')
  const storedSchedules = () => all('SELECT * FROM charge_schedules ORDER BY id')
  const hostingId = () => (all('SELECT id FROM hostings')[0] as { id: number }).id

  function migrateToHosting() {
    applyMigrations(sqlite, { from: NEW, to: AUTO })
    applyMigrations(sqlite, { from: HOSTING })
  }

  function seedStoredRows() {
    seedSites()
    applyMigrations(sqlite, { from: NEW, to: AUTO })
    sqlite.exec(`
      INSERT INTO expenses (id, site_id, date, amount, type, comment, is_estimate, created_at, updated_at) VALUES
        (1, NULL, '2024-01-01', 30000, 'hosting', 'год', 0, 5, 6),
        (2, NULL, '2025-01-01', 31000, 'hosting', NULL, 0, 7, 8),
        (3, 1, '2025-01-01', 32000, 'hosting', NULL, 0, 9, 10),
        (4, 1, '2026-07-26', 87000, 'telephony', 'Самара', 0, 11, 12),
        (5, 2, '2026-08-25', 87000, 'telephony', 'Оценка', 1, 13, 14),
        (6, NULL, '2026-07-26', 100, 'telephony', NULL, 0, 15, 16);
      INSERT INTO charge_schedules (provider, provider_number_id, enabled, next_date, amount, no_charge_period_end, created_at, updated_at) VALUES
        ('gudok', '4635', 1, '2026-11-26', 87000, '2026-10-31', 17, 18),
        ('gudok', '4255', 0, '2026-12-01', 90000, NULL, 19, 20);
    `)
    sqlite.prepare("UPDATE charge_schedules SET interval_days = 14 WHERE provider_number_id = '4255'").run()
  }

  it('runs on a fresh empty database and adds the hosting', () => {
    migrateToHosting()

    expect(all('SELECT provider, account FROM hostings')).toEqual([
      { provider: 'sprinthost', account: 'a0181620' },
    ])
    expect(all('SELECT * FROM expenses')).toEqual([])
    expect(storedSchedules()).toEqual([])
  })

  it('links every stored site and keeps the rest of the row', () => {
    seedStoredRows()
    const before = all('SELECT * FROM sites ORDER BY id')

    applyMigrations(sqlite, { from: HOSTING })

    expect(before).toHaveLength(2)
    expect(all('SELECT * FROM sites ORDER BY id')).toEqual(
      before.map(row => ({ ...row, hosting_id: hostingId() })),
    )
  })

  it('links only hosting rows with no site and changes nothing else in expenses', () => {
    seedStoredRows()
    const before = storedExpenses()

    applyMigrations(sqlite, { from: HOSTING })

    const linked = [1, 2]
    expect(storedExpenses()).toEqual(before.map(row => ({
      ...row,
      hosting_id: linked.includes(row.id as number) ? hostingId() : null,
    })))
  })

  it('keeps number schedules and their intervals, and seeds no schedule', () => {
    seedStoredRows()
    const before = storedSchedules()

    applyMigrations(sqlite, { from: HOSTING })

    expect(storedSchedules()).toEqual(before.map(row => ({ ...row, hosting_id: null, interval_months: null })))
  })

  describe('after the migration', () => {
    const insertExpense = (site: number | null, hosting: number | null, date = '2026-03-01', type = 'hosting') =>
      sqlite
        .prepare(`INSERT INTO expenses (site_id, hosting_id, date, amount, type, created_at, updated_at)
          VALUES (?, ?, ?, 100, ?, 0, 0)`)
        .run(site, hosting, date, type)
    const insertNumberSchedule = (numberId: string) =>
      sqlite
        .prepare(`INSERT INTO charge_schedules (provider, provider_number_id, next_date, amount, created_at, updated_at)
          VALUES ('gudok', ?, '2026-11-26', 87000, 0, 0)`)
        .run(numberId)
    const insertHostingSchedule = (hosting: number | null, months: number | null = 12) =>
      sqlite
        .prepare(`INSERT INTO charge_schedules (hosting_id, interval_days, interval_months, next_date, amount, created_at, updated_at)
          VALUES (?, NULL, ?, '2026-11-26', 87000, 0, 0)`)
        .run(hosting, months)
    const addSecondHosting = () =>
      Number(
        sqlite
          .prepare(`INSERT INTO hostings (provider, account, created_at, updated_at)
            VALUES ('sprinthost', 'b0000000', 0, 0)`)
          .run().lastInsertRowid,
      )

    beforeEach(() => {
      seedSites()
      applyMigrations(sqlite, { from: NEW, to: AUTO })
      applyMigrations(sqlite, { from: HOSTING })
      sqlite.pragma('foreign_keys = ON')
    })

    it('refuses a second hosting with the same provider and account', () => {
      expect(() => sqlite.exec(`
        INSERT INTO hostings (provider, account, created_at, updated_at)
          VALUES ('sprinthost', 'a0181620', 0, 0);
      `)).toThrow(/UNIQUE/)
    })

    it('keeps a site when its hosting is deleted', () => {
      const id = addSecondHosting()
      sqlite.prepare('UPDATE sites SET hosting_id = ? WHERE id = 1').run(id)

      sqlite.prepare('DELETE FROM hostings WHERE id = ?').run(id)

      expect(all('SELECT hosting_id FROM sites WHERE id = 1')).toEqual([{ hosting_id: null }])
    })

    it('refuses to delete a hosting that has charge rows', () => {
      const id = addSecondHosting()
      insertExpense(null, id)

      expect(() => sqlite.prepare('DELETE FROM hostings WHERE id = ?').run(id)).toThrow(/FOREIGN KEY/)
    })

    it('refuses an expense with both a site and a hosting', () => {
      expect(() => insertExpense(1, hostingId())).toThrow(/CHECK/)
    })

    it('lets two hostings hold rows on one date, but one hosting only one', () => {
      insertExpense(null, hostingId())
      insertExpense(null, addSecondHosting())

      expect(() => insertExpense(null, hostingId())).toThrow(/UNIQUE/)
    })

    it('still holds one company-level row per date and type with no hosting', () => {
      insertExpense(null, null)

      expect(() => insertExpense(null, null)).toThrow(/UNIQUE/)
    })

    it('holds one schedule per hosting and deletes it with the hosting', () => {
      const id = addSecondHosting()
      insertHostingSchedule(id)

      expect(() => insertHostingSchedule(id)).toThrow(/UNIQUE/)

      sqlite.prepare('DELETE FROM hostings WHERE id = ?').run(id)
      expect(storedSchedules()).toEqual([])
    })

    it('gives a number schedule the default of 30 days', () => {
      insertNumberSchedule('4635')

      expect(storedSchedules()).toMatchObject([{ interval_days: 30, interval_months: null, hosting_id: null }])
    })

    it.each([
      ['a number and a hosting', '\'gudok\', \'4635\', 1, NULL, 12'],
      ['a number with months', '\'gudok\', \'4635\', NULL, 30, 12'],
      ['a number with no interval', '\'gudok\', \'4635\', NULL, NULL, NULL'],
      ['half a number', '\'gudok\', NULL, NULL, 30, NULL'],
      ['a hosting with days', 'NULL, NULL, 1, 30, 12'],
      ['a hosting with no months', 'NULL, NULL, 1, NULL, NULL'],
      ['a hosting with zero months', 'NULL, NULL, 1, NULL, 0'],
      ['neither', 'NULL, NULL, NULL, NULL, NULL'],
    ])('refuses a schedule with %s', (_, values) => {
      expect(() => sqlite.exec(`
        INSERT INTO charge_schedules (provider, provider_number_id, hosting_id, interval_days, interval_months, next_date, amount, created_at, updated_at)
          VALUES (${values}, '2026-11-26', 87000, 0, 0);
      `)).toThrow(/CHECK/)
    })
  })
})
