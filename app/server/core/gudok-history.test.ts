import { describe, expect, it } from 'vitest'

import { GudokPayloadError } from './gudok-calls'
import {
  cleanProject,
  parseGudokAmountKopecks,
  parseGudokOperationDate,
  parseGudokReply,
  rowsInPeriod,
} from './gudok-history'

const span = (value: string, name = 'text', first = false) =>
  `<span class="cell-content common-text" data-column-name="${name}" data-aligning-help="center"${
    first ? ` id="table-${name}-cell"` : ''
  }>${value}</span>`
const ruble = '<span class="ruble-icon">i</span>'
const money = (value: string, first = false) => span(
  `<span class="amount-value ${value.startsWith('-') ? 'not-positive-value' : ''}">${value} ${ruble}</span>`,
  'amount',
  first,
)
const project = (value: string, first = false) => span(`<span class="project">${value}</span>`, 'project', first)

// Four rows in Gudok's markup with made-up values, taken from the live reply:
// one per kind, and the row that carries id attributes the others do not have.
const REPLY = {
  recordsTotal: 4,
  recordsFiltered: 4,
  draw: 1,
  data: [
    {
      DT_RowId: '1',
      created_at: span('24.10.2026', 'created_at', true),
      text: span('Продление<strong>: Гудок-номер</strong>', 'text', true),
      project: project('Ростов-На-Д..', true),
      kind_texted: span('Списание', 'kind_texted', true),
      amount: money('-870,000', true),
      current_balance: span(`100,000 ${ruble}`, 'current_balance', true),
    },
    {
      DT_RowId: '2',
      created_at: span('23.10.2026', 'created_at'),
      text: span('Оплата &amp; бонус'),
      project: project('..'),
      kind_texted: span('Пополнение', 'kind_texted'),
      amount: money('870,000'),
      current_balance: span(`970,000 ${ruble}`, 'current_balance'),
    },
    {
      DT_RowId: '3',
      created_at: span('22.10.2026', 'created_at'),
      text: span('Бонус<strong>: возврат</strong>'),
      project: project('Волгоград..'),
      kind_texted: span('-', 'kind_texted'),
      amount: money('5,000'),
      current_balance: span(`100,000 ${ruble}`, 'current_balance'),
    },
    {
      DT_RowId: '4',
      created_at: span('21.10.2026', 'created_at'),
      text: span('Продление<strong>: Гудок-номер</strong>'),
      project: project('Волгоград..'),
      kind_texted: span('Списание', 'kind_texted'),
      amount: money('-870,000'),
      current_balance: span(`95,000 ${ruble}`, 'current_balance'),
    },
  ],
}

const replyWith = (over: Record<string, unknown>) =>
  ({ ...REPLY, data: [{ ...REPLY.data[0], ...over }, ...REPLY.data.slice(1)] })

describe('parseGudokAmountKopecks', () => {
  it('parses comma-decimal ruble strings to positive kopecks', () => {
    expect(parseGudokAmountKopecks('-870,000 i')).toBe(87000)
    expect(parseGudokAmountKopecks('870,000')).toBe(87000)
    expect(parseGudokAmountKopecks('-1 234,50')).toBe(123450)
  })
  it('returns null on garbage', () => {
    expect(parseGudokAmountKopecks('—')).toBeNull()
  })
})

describe('parseGudokOperationDate', () => {
  it('parses DD.MM.YY and DD.MM.YYYY', () => {
    expect(parseGudokOperationDate('26.07.26')).toBe('2026-07-26')
    expect(parseGudokOperationDate('24.07.2026')).toBe('2026-07-24')
  })
})

describe('parseGudokReply', () => {
  it('reads every row, with no HTML left', () => {
    expect(parseGudokReply(REPLY)).toEqual([
      { date: '24.10.2026', text: 'Продление: Гудок-номер', project: 'Ростов-На-Д..', kind: 'Списание', amount: '-870,000 i' },
      { date: '23.10.2026', text: 'Оплата & бонус', project: '..', kind: 'Пополнение', amount: '870,000 i' },
      { date: '22.10.2026', text: 'Бонус: возврат', project: 'Волгоград..', kind: '-', amount: '5,000 i' },
      { date: '21.10.2026', text: 'Продление: Гудок-номер', project: 'Волгоград..', kind: 'Списание', amount: '-870,000 i' },
    ])
  })

  it('reads an amount with thousands', () => {
    expect(parseGudokReply(replyWith({ amount: money('-1 234,500') }))[0].amount).toBe('-1 234,500 i')
  })

  it.each([
    ['null', null, 'нет recordsFiltered или data'],
    ['a list', [], 'нет recordsFiltered или data'],
    ['no data', { recordsFiltered: 1 }, 'нет recordsFiltered или data'],
    ['no count', { data: REPLY.data }, 'нет recordsFiltered или data'],
    ['no rows', { recordsFiltered: 0, data: [] }, 'в ответе нет строк'],
    ['rows short of the count', { ...REPLY, recordsFiltered: 5 }, 'пришло 4 строк из 5'],
    ['a row that is not an object', { ...REPLY, data: [null, ...REPLY.data.slice(1)] }, 'строка 1: нет created_at, project, kind_texted, amount'],
    ['a missing field', replyWith({ project: undefined }), 'строка 1: нет project'],
    ['a short year', replyWith({ created_at: span('24.10.26') }), 'строка 1: дата "24.10.26"'],
    ['a day past the month end', replyWith({ created_at: span('31.02.2026') }), 'строка 1: дата "31.02.2026"'],
    ['a leap day in a common year', replyWith({ created_at: span('29.02.2026') }), 'строка 1: дата "29.02.2026"'],
    ['an amount with no decimals', replyWith({ amount: span('-870') }), 'строка 1: сумма "-870"'],
    ['an amount with a point', replyWith({ amount: money('-870.000') }), 'строка 1: сумма "-870.000 i"'],
    ['an unknown kind', replyWith({ kind_texted: span('Оплата') }), 'строка 1: неизвестный тип "Оплата"'],
  ])('stops on %s', (_, reply, mismatch) => {
    expect(() => parseGudokReply(reply))
      .toThrow(new GudokPayloadError(`Гудок изменился: ${mismatch}. Ничего не записано`))
  })

  it('tells the old script to update', () => {
    expect(() => parseGudokReply({ operations: [], period: { start: '2026-10-01', end: '2026-10-31' } }))
      .toThrow(new GudokPayloadError('Скрипт устарел: возьмите новый из scripts/gudok-telephony-console.js'))
  })

  it('names the first three mismatches and the total', () => {
    const data = REPLY.data.map(row => ({ ...row, kind_texted: span('Оплата') }))
    expect(() => parseGudokReply({ ...REPLY, data })).toThrow(new GudokPayloadError(
      'Гудок изменился: строка 1: неизвестный тип "Оплата"; строка 2: неизвестный тип "Оплата"; '
      + 'строка 3: неизвестный тип "Оплата"; всего расхождений: 4. Ничего не записано',
    ))
  })
})

describe('rowsInPeriod', () => {
  it('keeps the rows inside the period, both ends included', () => {
    const rows = parseGudokReply(REPLY)
    const dates = rowsInPeriod(rows, { start: '2026-10-22', end: '2026-10-23' }).map(row => row.date)
    expect(dates).toEqual(['23.10.2026', '22.10.2026'])
  })
})

describe('cleanProject', () => {
  it('strips trailing dots', () => {
    expect(cleanProject('Волгоград..')).toBe('Волгоград')
  })
})
