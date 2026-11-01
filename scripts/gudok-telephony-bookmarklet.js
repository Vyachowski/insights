/*
 * Gudok telephony expense collector — bookmarklet source.
 *
 * Run this on the authenticated Gudok operations page (https://in.gudok.tel/history).
 * It asks our app which day to start from, expands the date range back to that
 * day, loads the in-range operations, scrapes the "Списание" (charge) rows, and
 * posts them with the period to our ingest endpoint. A run that did not reach
 * that day stops and posts nothing. Nothing is stored about your Gudok login —
 * it runs inside your existing session.
 *
 * Install: set APP_URL and SECRET below, minify to a single line, and prefix
 * with `javascript:` to use as a browser bookmark. See the companion README.
 */
(async function gudokTelephony() {
  const APP_URL = 'https://YOUR_APP_URL' // e.g. https://insights.example.com
  const SECRET = 'YOUR_GUDOK_WEBHOOK_SECRET'

  const base = `${APP_URL}/webhooks/gudok/expenses/${SECRET}`
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

  // Date -> local 'YYYY-MM-DD'. toISOString gives the previous day in Moscow.
  const localDay = d => [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')

  function table() {
    const dt = window.data_table_controller?.datatable_obj
    if (!dt) throw new Error('таблица операций не найдена')
    return dt
  }

  // The dates of the table's last request. Only a request changes them, so
  // unlike the picker they cannot show a range the page never asked for.
  function loadedRange() {
    const dates = table().ajax.params()?.dates
    const start = ruDate(dates?.[0])
    const end = ruDate(dates?.[1])
    return start && end ? { start, end } : null
  }

  // Runs `action` and waits for the table to redraw. Until then it keeps the old
  // rows and counts, and the load-more button stays visible.
  function redraw(action) {
    return new Promise((resolve, reject) => {
      const dt = table()
      const done = () => { clearTimeout(timer); resolve() }
      const timer = setTimeout(() => {
        dt.off('draw', done)
        reject(new Error('таблица не обновилась за 15 секунд'))
      }, 15000)
      dt.one('draw', done)
      action()
    })
  }

  // The same path as the picker's "Применить": the table requests dp.interval.
  function setPeriod(start, end, rangeKey) {
    const dp = window.goodok_daterangepicker
    dp.daterangepicker.setStartDate(start)
    dp.daterangepicker.setEndDate(end)
    dp.set_current_date_interval(start, end, rangeKey)
  }

  const allLoaded = () => scrapeRows().length >= table().page.info().recordsDisplay

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

  const needed = sinceDate.toLocaleDateString('ru-RU')
  let undoRange = () => {}

  function stop(reason) {
    let note = ''
    try { undoRange() } catch (e) { note = `\nПериод в Гудке не вернулся: ${e.message}. Обновите страницу.` }
    alert(`Ничего не отправлено: ${reason}\n`
      + `Выставьте в Гудке период с ${needed} по сегодня и запустите снова.${note}`)
  }

  try {
    // 2. Widen Gudok's date range to [since .. today]. A range that already covers
    //    `since` was set by the admin: leave it alone.
    const found = loadedRange()
    if (found && found.start <= sinceDate && found.end < today) {
      // The server would treat the days after this end as checked: it would
      // delete their estimates and record the reconciliation up to today.
      stop(`период в Гудке заканчивается ${found.end.toLocaleDateString('ru-RU')}, а нужен по сегодня.`)
      return
    }
    if (!found || found.start > sinceDate) {
      const { start, end, 'range-key': rangeKey } = window.goodok_daterangepicker.interval
      undoRange = () => setPeriod(start, end, rangeKey)
      await redraw(() => setPeriod(window.moment(sinceDate), window.moment(today).endOf('day')))
      const range = loadedRange()
      if (!range || range.start > sinceDate || range.end < today) {
        stop('страница не загрузила нужный период.')
        return
      }
    }

    // 3. Load more until we've covered `since` (rows are date-desc), bounded.
    for (let i = 0; i < 200 && !allLoaded(); i++) {
      const oldest = oldestLoadedDate()
      if (oldest && oldest < sinceDate) break
      const btn = moreButton()
      if (!btn) break
      await redraw(() => btn.click())
    }

    // The range is proven, so `since` is reached by an older row or by the whole
    // list: a day may have no operations, so no older row exists.
    const oldest = oldestLoadedDate()
    if (!(oldest && oldest < sinceDate) && !allLoaded()) {
      const loaded = oldest ? `загружены только с ${oldest.toLocaleDateString('ru-RU')}` : 'операции не загружены'
      stop(`нужны операции с ${needed}, а ${loaded}.`)
      return
    }
  } catch (e) {
    stop(`не удалось загрузить период: ${e.message}.`)
    return
  }

  // 4. Collect charge rows within [since .. today]. An empty list still goes to
  //    the server: it replaces the estimates of the period.
  const period = { start: localDay(sinceDate), end: localDay(today) }
  const operations = scrapeRows().filter(r => {
    const d = ruDate(r.date)
    return r.kind === 'Списание' && d && d >= sinceDate && d <= today
  })

  // 5. text/plain keeps it a "simple" CORS request (no preflight).
  try {
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      credentials: 'omit',
      body: JSON.stringify({ operations, period }),
    })
    const out = await readReply(res)
    alert(`Готово. Отправлено ${operations.length} списаний.\n`
      + `Создано: ${out.created}, обновлено: ${out.updated}, пропущено: ${out.skipped}.\n`
      + `Заменено оценок: ${out.deletedEstimates}.`)
  } catch (e) {
    alert('Ошибка отправки: ' + e)
  }
})()
