import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import * as schema from '@/server/schema'
import { applyMigrations } from '@/server/test-migrations'

// Real in-memory SQLite built from the committed migrations, shared with the
// module under test via the db mock below.
const sqlite = new Database(':memory:')
const testDb = drizzle(sqlite, { schema })

vi.mock('@/server/db', () => ({ db: testDb }))

const { ingestGudokCall, GudokPayloadError } = await import('./gudok-webhook')

const basePayload = {
  id: 1001,
  project_id: 7,
  project_title: 'Дезинсекция – Самара',
  dst: '+79000000000',
  adv_channel_id: '4635',
  adv_channel_name: 'Самара',
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
  applyMigrations(sqlite)
})

beforeEach(() => {
  sqlite.exec('DELETE FROM calls; DELETE FROM phone_numbers; DELETE FROM sites; DELETE FROM cities;')
  sqlite.exec(
    "INSERT INTO cities (id, code, slug, name, population, created_at, updated_at) VALUES (1, 'SAM', 'samara', 'Самара', 100, 0, 0), (2, 'KZN', 'kazan', 'Казань', 100, 0, 0);",
  )
  sqlite.exec(
    "INSERT INTO sites (id, city_id, url, yandex_counter_id, gudok_project_id, created_at, updated_at) VALUES (5, 1, 'https://samara.example.com/', '111', 7, 0, 0), (6, 2, 'https://kazan.example.com/', '222', 8, 0, 0);",
  )
})

function rows() {
  return sqlite.prepare('SELECT * FROM calls').all() as Record<string, unknown>[]
}

function numbers() {
  return sqlite.prepare('SELECT * FROM phone_numbers').all() as Record<string, unknown>[]
}

describe('ingestGudokCall', () => {
  it('maps fields onto the row and resolves the site', async () => {
    const result = await ingestGudokCall(basePayload)
    expect(result).toMatchObject({ stored: true, duplicate: false, gudokId: 1001, siteId: 5 })

    const [row] = rows()
    expect(row).toMatchObject({
      site_id: 5,
      provider: 'gudok',
      provider_number_id: '4635',
      provider_call_id: '1001',
      src: '+79111111111',
      callstatus: 'ANSWERED',
      billsec: 30,
      region: 'Самарская область',
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
    const result = await ingestGudokCall({ ...basePayload, id: 1003, project_id: 99, project_title: 'Неизвестный город' })
    expect(result.siteId).toBeNull()
    expect(rows()[0].site_id).toBeNull()
    expect(rows()[0].raw).toBeTruthy()
  })

  it('is idempotent on the call id (duplicate delivery is a no-op)', async () => {
    await ingestGudokCall(basePayload)
    const [before] = numbers()
    const result = await ingestGudokCall(basePayload)
    expect(result).toMatchObject({ stored: false, duplicate: true })
    expect(rows()).toHaveLength(1)
    expect(numbers()).toEqual([before])
  })

  it('creates a new number, taking the site from the project', async () => {
    await ingestGudokCall(basePayload)
    expect(numbers()).toEqual([
      expect.objectContaining({
        provider: 'gudok',
        provider_number_id: '4635',
        number: '79000000000',
        site_id: 5,
        name: 'Самара',
      }),
    ])
  })

  it('falls back to the project title for a new number', async () => {
    const result = await ingestGudokCall({ ...basePayload, project_id: 99 })
    expect(result.siteId).toBe(5)
    expect(numbers()[0].site_id).toBe(5)
  })

  it('updates number and name on a known number but never its site', async () => {
    await ingestGudokCall(basePayload)
    const result = await ingestGudokCall({
      ...basePayload,
      id: 1004,
      call_number: 2,
      project_id: 8,
      dst: '+79000000001',
      adv_channel_name: 'Новое имя',
    })

    expect(result.siteId).toBe(5)
    expect(numbers()).toEqual([
      expect.objectContaining({ number: '79000000001', name: 'Новое имя', site_id: 5 }),
    ])
    expect(rows().map(row => row.site_id)).toEqual([5, 5])
  })

  it('keeps a known number with no site empty, and its calls too', async () => {
    await ingestGudokCall({ ...basePayload, project_id: 99, project_title: 'Неизвестный город' })
    const result = await ingestGudokCall({ ...basePayload, id: 1005 })
    expect(result.siteId).toBeNull()
    expect(numbers()[0].site_id).toBeNull()
  })

  it('stores the call and keeps its site when the number step fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await ingestGudokCall(basePayload)
    // Another channel already owns this phone: UNIQUE(number) rejects the insert
    const result = await ingestGudokCall({ ...basePayload, id: 1006, adv_channel_id: '9999', call_number: 2 })

    expect(result).toMatchObject({ stored: true, siteId: 5 })
    expect(rows()).toHaveLength(2)
    expect(numbers()).toHaveLength(1)
    expect(error).toHaveBeenCalledOnce()
    error.mockRestore()
  })

  it('stores a call with no channel id and creates no number', async () => {
    const result = await ingestGudokCall({ ...basePayload, adv_channel_id: '' })
    expect(result).toMatchObject({ stored: true, siteId: 5 })
    expect(rows()[0].provider_number_id).toBeNull()
    expect(numbers()).toHaveLength(0)
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
