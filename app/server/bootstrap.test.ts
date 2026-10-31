import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sqlite } from './db/client'

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
const fetchMock = vi.fn()

vi.mock('./env', () => ({
  env: mockEnv,
  isStorageConfigured: () => false,
}))

vi.mock('./services/fetch-file', () => ({
  fetchUrlToBuffer: (url: string) => fetchMock(url),
}))

const { bootstrap } = await import('./bootstrap')

const rows = (table: string) =>
  sqlite.prepare(`SELECT * FROM ${table}`).all() as Record<string, unknown>[]

const fetchCsv = (url: string) =>
  Promise.resolve(Buffer.from(url.includes('cities') ? CITIES_CSV : SITES_CSV))

beforeEach(() => {
  fetchMock.mockReset()
  sqlite.exec('DELETE FROM sites; DELETE FROM cities; DELETE FROM users;')
  for (const key of Object.keys(mockEnv)) delete mockEnv[key]
  Object.assign(mockEnv, FULL_ENV)
})

describe('bootstrap on a fresh database', () => {
  beforeEach(async () => {
    fetchMock.mockImplementation(fetchCsv)
    await bootstrap()
  })

  it('creates both users with hashed passwords and roles', () => {
    const users = rows('users')
    expect(users).toHaveLength(2)
    expect(users[0]).toMatchObject({ email: 'admin@test.com', role: 'ADMIN' })
    expect(users[1]).toMatchObject({ email: 'user@test.com', role: 'USER' })
    expect(users[0].password).not.toBe('secret')
    expect(String(users[0].password)).toMatch(/^\$argon2/)
  })

  it('inserts cities preserving explicit ids', () => {
    expect(rows('cities')[0]).toMatchObject({ id: 1, code: 'SAM', population: 100 })
  })

  it('inserts sites with empty optionals as null', () => {
    expect(rows('sites')[0]).toMatchObject({
      id: 1,
      city_id: 1,
      yandex_counter_id: '111',
      google_counter_id: null,
    })
  })
})

describe('bootstrap on a populated database', () => {
  it('skips every step and never fetches', async () => {
    fetchMock.mockImplementation(fetchCsv)
    await bootstrap()
    fetchMock.mockClear()

    await bootstrap()

    expect(rows('users')).toHaveLength(2)
    expect(rows('cities')).toHaveLength(1)
    expect(rows('sites')).toHaveLength(1)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('bootstrap with missing env vars', () => {
  it('skips all steps without fetching or inserting', async () => {
    for (const key of Object.keys(mockEnv)) delete mockEnv[key]
    await bootstrap()

    expect(rows('users')).toEqual([])
    expect(rows('cities')).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('skips users when only admin vars are set', async () => {
    for (const key of Object.keys(mockEnv)) delete mockEnv[key]
    mockEnv.ADMIN_EMAIL = FULL_ENV.ADMIN_EMAIL
    mockEnv.ADMIN_PASSWORD = FULL_ENV.ADMIN_PASSWORD
    await bootstrap()

    expect(rows('users')).toEqual([])
  })
})

describe('bootstrap with a failing fetch', () => {
  it('logs the error and does not throw; users step still runs', async () => {
    fetchMock.mockRejectedValue(new Error('Failed to fetch URL: 404'))

    await expect(bootstrap()).resolves.toBeUndefined()
    expect(rows('users')).toHaveLength(2)
    expect(rows('cities')).toEqual([])
    expect(rows('sites')).toEqual([])
  })
})
