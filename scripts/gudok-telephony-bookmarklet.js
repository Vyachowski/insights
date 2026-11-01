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

  // First day of the page's date range (local midnight), or null when unknown.
  function pageRangeStart() {
    const start = window.goodok_daterangepicker?.startDate?.toDate?.()
    if (start) return new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const text = document.querySelector('#daterangepicker-text')?.textContent || ''
    const first = /\d{2}\.\d{2}\.\d{2,4}/.exec(text)
    return first ? ruDate(first[0]) : null
  }

  function moreButton() {
    const btn = document.querySelector('.load-more-btn')
    return btn && btn.offsetParent !== null ? btn : null
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
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sinceDate = since
    ? new Date(`${since}T00:00:00`)
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90)

  // Only the range found here proves anything. After we write to the picker it
  // shows our dates, whether or not the page loaded them.
  const foundStart = pageRangeStart()
  const rangeCovered = Boolean(foundStart) && foundStart <= sinceDate
  let undoRange = () => {}

  // 2. Best-effort: widen Gudok's date range to [since .. today] via the page's
  //    own picker, then reload. Selectors/API may drift — adjust to the live page.
  //    A range that already covers `since` was set by the admin: leave it alone.
  try {
    if (!rangeCovered && window.goodok_daterangepicker && window.moment && window.data_table_controller) {
      const dp = window.goodok_daterangepicker
      const txt = document.querySelector('#daterangepicker-text')
      const saved = { start: dp.startDate, end: dp.endDate, text: txt?.textContent }
      undoRange = () => {
        dp.startDate = saved.start
        dp.endDate = saved.end
        if (txt) txt.textContent = saved.text
      }
      dp.startDate = window.moment(sinceDate)
      dp.endDate = window.moment()
      if (txt) txt.textContent = `${dp.startDate.format('DD.MM.YY')} – ${dp.endDate.format('DD.MM.YY')}`
      window.data_table_controller.change_dates()
      await sleep(1500)
    }
  } catch (e) { /* fall through to load-more within the current range */ }

  // 3. Load more until we've covered `since` (rows are date-desc), bounded.
  let fullyLoaded = false
  for (let i = 0; i < 200; i++) {
    const oldest = oldestLoadedDate()
    if (oldest && oldest < sinceDate) break
    const btn = moreButton()
    if (btn) {
      btn.click()
      await sleep(700)
      continue
    }
    await sleep(1500) // the button may hide for a moment while rows load
    if (!moreButton()) {
      fullyLoaded = true
      break
    }
  }

  // Stop unless the rows prove `since` was reached. The range counts only with
  // the whole list loaded: a day may have no operations, so no older row exists.
  const oldest = oldestLoadedDate()
  if (!(oldest && oldest < sinceDate) && !(rangeCovered && fullyLoaded)) {
    undoRange() // or the next click would read our dates as the page's own
    const needed = sinceDate.toLocaleDateString('ru-RU')
    const loaded = oldest ? `загружены только с ${oldest.toLocaleDateString('ru-RU')}` : 'операции не загружены'
    alert(`Ничего не отправлено: нужны операции с ${needed}, а ${loaded}.\n`
      + `Выставьте в Гудке период с ${needed} по сегодня и запустите снова.`)
    return
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
