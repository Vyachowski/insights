import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

import { beforeEach, describe, expect, it, vi } from 'vitest'

const SOURCE = readFileSync(new URL('./gudok-telephony-console.js', import.meta.url), 'utf8')
const APP_POST = 'https://insights.vypro.ru/webhooks/gudok/expenses/top-secret'
const REPLY = { recordsFiltered: 1, data: [{ DT_RowId: '1' }] }
const RESULT = {
  ok: true,
  created: 1,
  updated: 2,
  skipped: 3,
  deletedEstimates: 4,
  period: { start: '2026-10-27', end: '2026-11-01' },
}

const fakeFetch = vi.fn()
const fakeAlert = vi.fn()
const fakePrompt = vi.fn()

function reply(body: string, { status = 200, url = 'https://in.gudok.tel/any' } = {}) {
  return Object.defineProperty(new Response(body, { status }), 'url', { value: url })
}
const offlinePage = () => reply('<title>Нет связи</title>', { url: 'https://in.gudok.tel/offline/offline.html' })
const gudokOk = () => reply(JSON.stringify(REPLY))

const run = () => runInNewContext(SOURCE, {
  fetch: fakeFetch,
  alert: fakeAlert,
  prompt: fakePrompt,
  URLSearchParams,
}) as Promise<void>

/** The replies of Gudok and then Insights. */
function replies(...list: (Response | Error)[]) {
  for (const item of list) {
    if (item instanceof Error) fakeFetch.mockRejectedValueOnce(item)
    else fakeFetch.mockResolvedValueOnce(item)
  }
}

beforeEach(() => {
  fakeFetch.mockReset()
  fakeAlert.mockReset()
  fakePrompt.mockReset()
  fakePrompt.mockReturnValue(' top-secret ')
})

describe('gudok console script', () => {
  it.each([[null], [''], ['  ']])('ends with no message on the answer %j', async answer => {
    fakePrompt.mockReturnValue(answer)
    await run()
    expect(fakeFetch).not.toHaveBeenCalled()
    expect(fakeAlert).not.toHaveBeenCalled()
  })

  it('reads the whole history in one request', async () => {
    replies(gudokOk(), reply(JSON.stringify(RESULT)))
    await run()
    const query = new URLSearchParams(String(fakeFetch.mock.calls[0][0]).split('?')[1])
    expect(String(fakeFetch.mock.calls[0][0])).toMatch(/^\/history\.json\?/)
    expect(query.getAll('dates[]')).toEqual(['01.01.2015', new Date().toLocaleDateString('ru-RU')])
    expect(query.get('start')).toBe('0')
    expect(query.get('length')).toBe('10000')
  })

  it('posts the reply as it is and shows the result', async () => {
    replies(gudokOk(), reply(JSON.stringify(RESULT)))
    await run()
    expect(fakeFetch).toHaveBeenLastCalledWith(APP_POST, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      credentials: 'omit',
      body: JSON.stringify(REPLY),
    })
    expect(fakeAlert).toHaveBeenCalledWith(
      'Готово. Период: 2026-10-27 — 2026-11-01.\n'
      + 'Создано: 1, обновлено: 2, пропущено: 3.\n'
      + 'Заменено оценок: 4.',
    )
  })

  it.each([
    ['no session', [reply('{"error":"x"}', { status: 401 })], 'Войдите в Гудок'],
    ['the offline page from Gudok', [offlinePage()], 'Нет связи с Гудком'],
    ['a failed fetch to Gudok', [new TypeError('NetworkError')], 'Нет связи с Гудком'],
    ['HTML from Gudok', [reply('<html>')], 'Гудок ответил не JSON: HTTP 200. Скрипт пора обновить'],
    ['a Gudok error as JSON', [reply('{"error":"x"}', { status: 500 })], 'Гудок ответил не JSON: HTTP 500. Скрипт пора обновить'],
  ])('stops before the post on %s', async (_, list, message) => {
    replies(...list)
    await run()
    expect(fakeFetch).toHaveBeenCalledTimes(1)
    expect(fakeAlert).toHaveBeenCalledWith(message)
  })

  it.each([
    ['the offline page with a 200', offlinePage(), 'Нет связи с Insights: проверьте сеть и адрес в скрипте'],
    ['a failed fetch', new TypeError('NetworkError'), 'Нет связи с Insights: проверьте сеть и адрес в скрипте'],
    ['a 404', reply('Not Found', { status: 404 }), 'Неверный секрет'],
    ['a server failure with no JSON', reply('<html>', { status: 502 }), 'Insights не принял запрос: HTTP 502'],
    ['a refused reply', reply('{"error":"Гудок изменился: в ответе нет строк. Ничего не записано"}', { status: 400 }), 'Гудок изменился: в ответе нет строк. Ничего не записано'],
  ])('shows the reason on %s', async (_, answer, message) => {
    replies(gudokOk(), answer)
    await run()
    expect(fakeAlert).toHaveBeenCalledWith(message)
  })
})
