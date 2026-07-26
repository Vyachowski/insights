import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import * as schema from '@/server/schema'

// Real in-memory SQLite built from the committed migrations, shared with the
// module under test via the db mock below.
const sqlite = new Database(':memory:')
const testDb = drizzle(sqlite, { schema })

vi.mock('@/server/db', () => ({ db: testDb }))

function applyMigrations() {
  const dir = path.resolve(__dirname, '../../../drizzle')
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
  sqlite.exec('PRAGMA foreign_keys=OFF;')
  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    for (const stmt of sql.split('--> statement-breakpoint')) {
      const trimmed = stmt.trim()
      if (trimmed) sqlite.exec(trimmed)
    }
  }
}

const { ingestGudokCall, GudokPayloadError } = await import('./gudok-webhook')

const basePayload = {
  id: 1001,
  project_id: 7,
  project_title: 'Дезинсекция – Самара',
  dst: '+79000000000',
  adv_channel_id: 'ch1',
  adv_channel_name: 'Yandex',
  src: '+79111111111',
  duration: 42,
  billsec: 30,
  callstatus: 'ANSWERED',
  date: '2026-07-26T10:00:00Z',
  region: 'Самарская область',
  call_number: 1,
  audio: 'https://gudok.tel/audio/1001.mp3',
}

beforeAll(() => {
  applyMigrations()
})

beforeEach(() => {
  sqlite.exec('DELETE FROM calls; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'SAM', 'samara', 'Самара', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, created_at, updated_at) VALUES (5, 1, 'https://samara.example.com/', '111', 0, 0);",
  )
})

function rows() {
  return sqlite.prepare('SELECT * FROM calls').all() as Record<string, unknown>[]
}

describe('ingestGudokCall', () => {
  it('maps fields onto the row and resolves the site', async () => {
    const result = await ingestGudokCall(basePayload)
    expect(result).toMatchObject({ stored: true, duplicate: false, gudokId: 1001, siteId: 5 })

    const [row] = rows()
    expect(row).toMatchObject({
      site_id: 5,
      gudok_id: 1001,
      project_id: 7,
      src: '+79111111111',
      callstatus: 'ANSWERED',
      call_number: 1,
      source: 'webhook',
    })
    expect(row.date).toBe(new Date('2026-07-26T10:00:00Z').getTime())
    expect(JSON.parse(row.raw as string).id).toBe(1001)
  })

  it('stores non-answered calls', async () => {
    await ingestGudokCall({ ...basePayload, id: 1002, callstatus: 'NO ANSWER', billsec: 0 })
    expect(rows()).toHaveLength(1)
    expect(rows()[0].callstatus).toBe('NO ANSWER')
  })

  it('stores unresolved projects with a null site', async () => {
    const result = await ingestGudokCall({ ...basePayload, id: 1003, project_title: 'Неизвестный город' })
    expect(result.siteId).toBeNull()
    expect(rows()[0].site_id).toBeNull()
    expect(rows()[0].raw).toBeTruthy()
  })

  it('is idempotent on gudokId (duplicate delivery is a no-op)', async () => {
    await ingestGudokCall(basePayload)
    const result = await ingestGudokCall(basePayload)
    expect(result).toMatchObject({ stored: false, duplicate: true })
    expect(rows()).toHaveLength(1)
  })

  it('rejects a payload missing id', async () => {
    const { id: _omit, ...noId } = basePayload
    await expect(ingestGudokCall(noId)).rejects.toBeInstanceOf(GudokPayloadError)
    expect(rows()).toHaveLength(0)
  })

  it('rejects a payload with an unparseable date', async () => {
    await expect(ingestGudokCall({ ...basePayload, date: 'not-a-date' })).rejects.toBeInstanceOf(
      GudokPayloadError,
    )
    expect(rows()).toHaveLength(0)
  })
})
