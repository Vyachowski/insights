import { describe, expect, it } from 'vitest'

import { HOSTING_TYPE, parseEntryForm, parseRevenueId } from './finance'

const revenue = { intent: 'add-revenue', amount: '1500.50', date: '2026-03-15', siteId: '5' }
const hosting = { intent: 'add-hosting', amount: '12000', year: '2026', siteId: '5' }

describe('parseEntryForm entries', () => {
  it('parses a revenue into kopecks', () => {
    expect(parseEntryForm(revenue)).toEqual({
      revenue: { date: '2026-03-15', siteId: 5, amount: 150050 },
    })
  })

  it('parses hosting as an expense on the first day of the year', () => {
    expect(parseEntryForm(hosting)).toEqual({
      expense: { date: '2026-01-01', siteId: 5, type: HOSTING_TYPE, amount: 1200000 },
    })
  })

  it.each([
    ['revenue', { ...revenue, siteId: '' }],
    ['hosting', { ...hosting, siteId: undefined }],
  ])('treats a %s with no site as company-wide', (_label, form) => {
    const entry = parseEntryForm(form)
    expect(Object.values(entry)[0]).toMatchObject({ siteId: null })
  })
})

describe('parseEntryForm errors', () => {
  it.each(['0', '-5', 'abc', '', undefined])('rejects the amount %j', amount => {
    expect(parseEntryForm({ ...revenue, amount })).toEqual({ error: 'Укажите сумму больше нуля' })
  })

  it.each(['abc', '1.5'])('rejects the site %j', siteId => {
    expect(parseEntryForm({ ...revenue, siteId })).toEqual({ error: 'Некорректный сайт' })
  })

  it.each(['1999', '2101', '2026.5', 'abc', undefined])('rejects the hosting year %j', year => {
    expect(parseEntryForm({ ...hosting, year })).toEqual({ error: 'Укажите год' })
  })

  it.each(['2026-02-30', '2026-13-01', '15.03.2026', '', undefined])('rejects the revenue date %j', date => {
    expect(parseEntryForm({ ...revenue, date })).toEqual({ error: 'Укажите дату' })
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
