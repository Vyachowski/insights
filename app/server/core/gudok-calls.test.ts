import { describe, expect, it } from 'vitest'

import { GudokPayloadError, parseGudokPayload } from './gudok-calls'

describe('parseGudokPayload', () => {
  it('coerces a delivery of strings and fills in the defaults', () => {
    const { payload, date } = parseGudokPayload({
      id: '42',
      date: '2026-07-26T10:00:00Z',
      billsec: '65',
      src: 79990000000,
    })
    expect(payload).toMatchObject({
      id: 42,
      billsec: 65,
      src: '79990000000',
      project_id: 0,
      project_title: '',
      callstatus: '',
    })
    expect(date.toISOString()).toBe('2026-07-26T10:00:00.000Z')
  })

  it.each([
    ['epoch seconds', '1785060000'],
    ['epoch milliseconds', '1785060000000'],
  ])('reads a date in %s', (_label, raw) => {
    const { date } = parseGudokPayload({ id: 1, date: raw })
    expect(date.getTime()).toBe(1785060000000)
  })

  it.each([
    ['a missing id', { date: '2026-07-26T10:00:00Z' }],
    ['an id that is not a number', { id: 'abc', date: '2026-07-26T10:00:00Z' }],
    ['a missing date', { id: 1 }],
    ['an empty date', { id: 1, date: '' }],
  ])('rejects %s', (_label, raw) => {
    expect(() => parseGudokPayload(raw)).toThrow(new GudokPayloadError('Invalid Gudok payload'))
  })

  it('rejects a date that cannot be read', () => {
    expect(() => parseGudokPayload({ id: 1, date: 'not a date' }))
      .toThrow(new GudokPayloadError('Invalid Gudok date'))
  })
})
