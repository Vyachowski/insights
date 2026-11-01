/*
 * Gudok telephony expense collector — paste into the browser console on the
 * signed-in Gudok page (https://in.gudok.tel/history).
 *
 * It asks for the secret, reads the whole operation history from Gudok's
 * /history.json inside your session, and posts the reply as it is. The server
 * checks every row and picks the period, so this file holds no rules about
 * Gudok's data. Nothing is stored: not your Gudok login, not the secret.
 */
(async function gudokTelephony() {
  const APP_URL = 'https://insights.vypro.ru'
  const HISTORY_START = '01.01.2015'
  const HISTORY_LENGTH = '10000'
  // Gudok's service worker answers every failed fetch with this page, as a 200,
  // also for other sites. So a failed post looks like a reply from Insights.
  const OFFLINE_PAGE = '/offline/offline.html'

  async function request(url, options, noConnection) {
    const res = await fetch(url, options).catch(() => null)
    if (!res || res.url.endsWith(OFFLINE_PAGE)) throw new Error(noConnection)
    return res
  }

  const readJson = res => res.json().catch(() => null)

  async function readHistory() {
    const query = new URLSearchParams([
      ['dates[]', HISTORY_START],
      ['dates[]', new Date().toLocaleDateString('ru-RU')],
      ['start', '0'],
      ['length', HISTORY_LENGTH],
    ])
    const res = await request(`/history.json?${query}`, {}, 'Нет связи с Гудком')
    if (res.status === 401) throw new Error('Войдите в Гудок')
    const reply = await readJson(res)
    if (!res.ok || !reply) throw new Error(`Гудок ответил не JSON: HTTP ${res.status}. Скрипт пора обновить`)
    return reply
  }

  // text/plain keeps it a "simple" CORS request (no preflight).
  async function post(secret, reply) {
    const res = await request(`${APP_URL}/webhooks/gudok/expenses/${encodeURIComponent(secret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      credentials: 'omit',
      body: JSON.stringify(reply),
    }, 'Нет связи с Insights: проверьте сеть и адрес в скрипте')
    if (res.status === 404) throw new Error('Неверный секрет')
    const out = await readJson(res)
    if (!out) throw new Error(`Insights не принял запрос: HTTP ${res.status}`)
    if (!res.ok) throw new Error(out.error)
    return out
  }

  const secret = prompt('Секрет GUDOK_WEBHOOK_SECRET')?.trim()
  if (!secret) return

  try {
    const out = await post(secret, await readHistory())
    alert(`Готово. Период: ${out.period.start} — ${out.period.end}.\n`
      + `Создано: ${out.created}, обновлено: ${out.updated}, пропущено: ${out.skipped}.\n`
      + `Заменено оценок: ${out.deletedEstimates}.`)
  } catch (e) {
    alert(e.message)
  }
})()
