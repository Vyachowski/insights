/*
 * Gudok telephony expense collector — bookmarklet source.
 *
 * Run this on the authenticated Gudok operations page (https://in.gudok.tel/history).
 * It asks our app for the latest day already stored, expands the date range back
 * to that day, loads the in-range operations, scrapes the "Списание" (charge)
 * rows, and posts them to our ingest endpoint. Nothing is stored about your
 * Gudok login — it runs inside your existing session.
 *
 * Install: set APP_URL and SECRET below, minify to a single line, and prefix
 * with `javascript:` to use as a browser bookmark. See the companion README.
 */
(async function gudokTelephony() {
  const APP_URL = 'https://YOUR_APP_URL' // e.g. https://insights.example.com
  const SECRET = 'YOUR_GUDOK_WEBHOOK_SECRET'

  const base = `${APP_URL}/webhooks/gudok/expenses/${SECRET}`
  const sleep = ms => new Promise(r => setTimeout(r, ms))
  const cell = (tr, name) =>
    (tr.querySelector(`[data-column-name="${name}"]`)?.textContent || '').trim()

  // The body of a good reply. An error is { error }, but a wrong secret gives a
  // plain-text 404, so this does not assume JSON.
  async function readReply(res) {
    const text = await res.text()
    let body = null
    try { body = JSON.parse(text) } catch (e) { /* reported below */ }
    if (res.ok && body) return body
    throw new Error(body?.error || `HTTP ${res.status} ${text}`.trim())
  }

  // "DD.MM.YYYY" -> Date (local midnight). Returns null when unparseable.
  function ruDate(s) {
    const m = /^(\d{2})\.(\d{2})\.(\d{2}|\d{4})$/.exec((s || '').trim())
    if (!m) return null
    const yyyy = m[3].length === 2 ? `20${m[3]}` : m[3]
    return new Date(`${yyyy}-${m[2]}-${m[1]}T00:00:00`)
  }

  function scrapeRows() {
    const trs = [...document.querySelectorAll('.account-operations tbody tr')]
    return trs.map(tr => ({
      id: tr.id,
      date: cell(tr, 'created_at'),
      text: cell(tr, 'text'),
      project: cell(tr, 'project'),
      kind: cell(tr, 'kind_texted'),
      amount: cell(tr, 'amount'),
    })).filter(r => r.date)
  }

  function oldestLoadedDate() {
    const rows = scrapeRows()
    const dates = rows.map(r => ruDate(r.date)).filter(Boolean)
    return dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null
  }

  // 1. Ask which day to collect from.
  let since = null
  try {
    const res = await fetch(`${base}/since`, { credentials: 'omit' })
    since = (await readReply(res)).since // 'YYYY-MM-DD' | null
  } catch (e) {
    alert('Не удалось получить дату синхронизации: ' + e)
    return
  }
  // Default: 90 days back when nothing stored yet.
  const sinceDate = since
    ? new Date(`${since}T00:00:00`)
    : new Date(Date.now() - 90 * 864e5)

  // 2. Best-effort: widen Gudok's date range to [since .. today] via the page's
  //    own picker, then reload. Selectors/API may drift — adjust to the live page.
  try {
    if (window.goodok_daterangepicker && window.moment && window.data_table_controller) {
      const dp = window.goodok_daterangepicker
      dp.startDate = window.moment(sinceDate)
      dp.endDate = window.moment()
      const txt = document.querySelector('#daterangepicker-text')
      if (txt) txt.textContent = `${dp.startDate.format('DD.MM.YY')} – ${dp.endDate.format('DD.MM.YY')}`
      window.data_table_controller.change_dates()
      await sleep(1500)
    }
  } catch (e) { /* fall through to load-more within the current range */ }

  // 3. Load more until we've covered `since` (rows are date-desc), bounded.
  for (let i = 0; i < 200; i++) {
    const oldest = oldestLoadedDate()
    if (oldest && oldest < sinceDate) break
    const btn = document.querySelector('.load-more-btn')
    if (!btn || btn.offsetParent === null) break
    btn.click()
    await sleep(700)
  }

  const oldest = oldestLoadedDate()
  if (oldest && oldest > sinceDate) {
    alert(`Внимание: загружены операции только с ${oldest.toLocaleDateString('ru-RU')}, `
      + `а нужно с ${sinceDate.toLocaleDateString('ru-RU')}. Выставьте период вручную и запустите снова.`)
  }

  // 4. Collect charge rows within [since .. today].
  const operations = scrapeRows().filter(r => {
    const d = ruDate(r.date)
    return r.kind === 'Списание' && d && d >= sinceDate
  })
  if (!operations.length) {
    alert('Не найдено списаний для отправки.')
    return
  }

  // 5. text/plain keeps it a "simple" CORS request (no preflight).
  try {
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      credentials: 'omit',
      body: JSON.stringify({ operations }),
    })
    const out = await readReply(res)
    alert(`Готово. Отправлено ${operations.length} списаний.\n`
      + `Создано: ${out.created}, обновлено: ${out.updated}, пропущено: ${out.skipped}.`)
  } catch (e) {
    alert('Ошибка отправки: ' + e)
  }
})()
