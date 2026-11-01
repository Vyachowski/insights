import { describe, expect, it } from 'vitest'

import { HOSTING_TYPE, parseEntryForm, parseRevenueId } from './finance'

const revenue = { intent: 'add-revenue', amount: '1500.50', date: '2026-03-15', siteId: '5' }
const hosting = { intent: 'add-hosting', amount: '12000', date: '2026-03-15', hostingId: '7' }

describe('parseEntryForm entries', () => {
  it('parses a revenue into kopecks', () => {
    expect(parseEntryForm(revenue)).toEqual({
      revenue: { date: '2026-03-15', siteId: 5, amount: 150050 },
    })
  })

  it('parses hosting as an expense of that hosting with no site', () => {
    expect(parseEntryForm({ ...hosting, siteId: '5' })).toEqual({
      expense: { date: '2026-03-15', siteId: null, hostingId: 7, type: HOSTING_TYPE, amount: 1200000 },
    })
  })

  it('treats a revenue with no site as company-wide', () => {
    expect(parseEntryForm({ ...revenue, siteId: '' })).toEqual({
      revenue: { date: '2026-03-15', siteId: null, amount: 150050 },
    })
  })
})

describe('parseEntryForm errors', () => {
  it.each(['0', '-5', 'abc', '', undefined])('rejects the amount %j', amount => {
    expect(parseEntryForm({ ...revenue, amount })).toEqual({ error: 'Укажите сумму больше нуля' })
  })

  it.each(['abc', '1.5'])('rejects the site %j', siteId => {
    expect(parseEntryForm({ ...revenue, siteId })).toEqual({ error: 'Некорректный сайт' })
  })

  it.each([
    ['revenue', revenue],
    ['hosting', hosting],
  ])('rejects a bad %s date', (_label, form) => {
    for (const date of ['2026-02-30', '2026-13-01', '15.03.2026', '', undefined]) {
      expect(parseEntryForm({ ...form, date })).toEqual({ error: 'Укажите дату' })
    }
  })

  it.each(['add-unknown', undefined])('rejects the intent %j', intent => {
    expect(parseEntryForm({ ...revenue, intent })).toEqual({ error: 'Неизвестное действие' })
  })
})

describe('parseRevenueId', () => {
  it('parses a stored id', () => {
    expect(parseRevenueId({ id: '7' })).toEqual({ id: 7 })
  })

  it.each(['0', '-1', '1.5', 'abc', '', undefined])('rejects the id %j', id => {
    expect(parseRevenueId({ id })).toEqual({ error: 'Некорректная запись' })
  })
})
