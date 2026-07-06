import { beforeEach, describe, expect, it, vi } from 'vitest'

const CITIES_CSV = 'id,code,slug,name,population\n1,SAM,samara,Самара,100\n'
const SITES_CSV
  = 'id,cityId,name,group,url,yandexCounterId,googleCounterId,yandexTagManagerId,googleTagManagerId\n'
    + '1,1,ses1,ses1,https://samara.example.com/,111,,,\n'

const FULL_ENV = {
  ADMIN_EMAIL: 'admin@test.com',
  ADMIN_PASSWORD: 'secret',
  ADMIN_NAME: 'Admin',
  ADMIN_LASTNAME: 'Adminov',
  USER_EMAIL: 'user@test.com',
  USER_PASSWORD: 'secret',
  USER_NAME: 'User',
  USER_LASTNAME: 'Userov',
  CITIES_CSV_URL: 'https://drive.example.com/cities',
  SITES_CSV_URL: 'https://drive.example.com/sites',
}

const mockEnv: Record<string, string | undefined> = {}

const counts = { users: 0, cities: 0, sites: 0 }
const inserted: Record<string, unknown[][]> = {}
const executeMock = vi.fn(async () => ({ rows: [] }))
const fetchMock = vi.fn()

vi.mock('./env', () => ({ env: mockEnv }))

vi.mock('./imports/csv', async importOriginal => ({
  ...(await importOriginal()),
  fetchUrlToBuffer: (url: string) => fetchMock(url),
}))

vi.mock('./db', async () => {
  const schema = await import('./schema')
  const tableName = (table: unknown) => {
    if (table === schema.users) return 'users'
    if (table === schema.cities) return 'cities'
    return 'sites'
  }
  return {
    db: {
      $count: vi.fn(async (table: unknown) => counts[tableName(table) as keyof typeof counts]),
      insert: vi.fn((table: unknown) => ({
        values: (rows: unknown[]) => ({
          returning: async () => {
            const name = tableName(table)
            inserted[name] = inserted[name] ?? []
            inserted[name].push(rows)
            return rows
          },
        }),
      })),
      execute: executeMock,
    },
  }
})

const { bootstrap } = await import('./bootstrap')

function insertedRows(table: string): Record<string, unknown>[] {
  return (inserted[table]?.[0] ?? []) as Record<string, unknown>[]
}

beforeEach(() => {
  fetchMock.mockReset()
  executeMock.mockClear()
  counts.users = 0
  counts.cities = 0
  counts.sites = 0
  for (const key of Object.keys(inserted)) delete inserted[key]
  for (const key of Object.keys(mockEnv)) delete mockEnv[key]
  Object.assign(mockEnv, FULL_ENV)
})

describe('bootstrap on a fresh database', () => {
  beforeEach(async () => {
    fetchMock.mockImplementation((url: string) =>
      Promise.resolve(Buffer.from(url.includes('cities') ? CITIES_CSV : SITES_CSV)))
    let cityCountCalls = 0
    // cities step sees 0, sites step (after insert) sees 1
    counts.cities = 0
    const { db } = await import('./db')
    const countMock = db.$count as unknown as ReturnType<typeof vi.fn>
    countMock.mockImplementation(async (table: unknown) => {
      const schema = await import('./schema')
      if (table === schema.cities) return cityCountCalls++ === 0 ? 0 : 1
      if (table === schema.users) return counts.users
      return counts.sites
    })
    await bootstrap()
  })

  it('creates both users with hashed passwords and roles', () => {
    const rows = insertedRows('users')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toMatchObject({ email: 'admin@test.com', role: 'ADMIN' })
    expect(rows[1]).toMatchObject({ email: 'user@test.com', role: 'USER' })
    expect(rows[0].password).not.toBe('secret')
    expect(String(rows[0].password)).toMatch(/^\$argon2/)
  })

  it('inserts cities preserving explicit ids', () => {
    expect(insertedRows('cities')[0]).toMatchObject({
      id: 1,
      code: 'SAM',
      population: 100,
    })
  })

  it('inserts sites with empty optionals as null', () => {
    expect(insertedRows('sites')[0]).toMatchObject({
      id: 1,
      cityId: 1,
      yandexCounterId: '111',
      googleCounterId: null,
    })
  })

  it('does not run manual sequence resets (SQLite AUTOINCREMENT handles it)', () => {
    expect(executeMock).not.toHaveBeenCalled()
  })
})

describe('bootstrap on a populated database', () => {
  it('skips every step and never fetches', async () => {
    counts.users = 2
    counts.cities = 40
    counts.sites = 40
    await bootstrap()

    expect(inserted).toEqual({})
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('bootstrap with missing env vars', () => {
  it('skips all steps without fetching or inserting', async () => {
    for (const key of Object.keys(mockEnv)) delete mockEnv[key]
    await bootstrap()

    expect(inserted).toEqual({})
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('skips users when only admin vars are set', async () => {
    for (const key of Object.keys(mockEnv)) delete mockEnv[key]
    mockEnv.ADMIN_EMAIL = FULL_ENV.ADMIN_EMAIL
    mockEnv.ADMIN_PASSWORD = FULL_ENV.ADMIN_PASSWORD
    await bootstrap()

    expect(inserted['users']).toBeUndefined()
  })
})

describe('bootstrap with a failing fetch', () => {
  it('logs the error and does not throw; users step still runs', async () => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch URL: 404'))

    await expect(bootstrap()).resolves.toBeUndefined()
    expect(insertedRows('users')).toHaveLength(2)
    expect(inserted['cities']).toBeUndefined()
    expect(inserted['sites']).toBeUndefined()
  })
})
