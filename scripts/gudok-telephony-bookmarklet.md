# Gudok telephony expense bookmarklet

Reconciles telephony expenses with Gudok. The server writes estimated charges;
this run takes the real number-renewal charges (телефония) from the Gudok
operations page and imports them into the Insights `expenses` table as
`type = 'telephony'`, replacing the estimates of the period it covers. Run it
about once a quarter.

Gudok has no API or export, so this scrapes the page inside your own logged-in
session. No Gudok credentials are stored anywhere.

## How it works

1. Asks the app `GET /webhooks/gudok/expenses/<secret>/since` where to start: the
   date of the oldest estimate, or the latest stored day when no estimates exist.
   With nothing stored it starts 90 days back.
2. Reads the range of the table's last request (`ajax.params().dates`). The picker
   does not prove anything: it shows any dates written to it, loaded or not.
   - A range that starts on or before the start date stays as it is. If it ends
     before today, the run stops and posts nothing.
   - Any other range is set to the start date through today, the same way the
     picker's "Применить" does it. The run waits for the table to redraw and reads
     the request range again. A range that did not change stops the run.
3. Loads the rows: clicks "Показать ещё" and waits for each redraw, only as far
   back as needed — not to the bottom every time.
4. Checks that it reached the start date. It did if a loaded row is older than
   that date, or if the whole list is loaded: a day may have no operations.
   Anything else stops the run, and nothing is posted. Every stop, a failed step
   included, shows a message with the reason and the period to set. A range the
   run changed goes back to what it was.
5. Posts the `Списание` (charge) rows dated inside the period to
   `POST /webhooks/gudok/expenses/<secret>`, with
   `period: { start, end }` in `YYYY-MM-DD`: the start date and today, by the
   browser's local date. A run with no charges still posts the empty list and the
   period.
6. The server deletes the estimates inside the period, groups charges per
   (day, city→site), sums them, and upserts one `telephony` expense per group.
   Estimates outside the period stay. Re-running is safe — it overwrites, never
   duplicates.

## Install

1. Open `scripts/gudok-telephony-bookmarklet.js`.
2. Set `APP_URL` (your deployed app origin) and `SECRET` (the value of
   `GUDOK_WEBHOOK_SECRET`).
3. Minify the file to a single line (any JS minifier) and prefix it with
   `javascript:`.
4. Create a new browser bookmark and paste that as the URL. Name it e.g.
   "Гудок → расходы".

## Use

1. Log into Gudok and open **Операции** (`https://in.gudok.tel/history`).
2. Click the bookmark. It sets the period itself when the page's range does not
   reach the start date. It reports how many charges were created/updated/skipped
   and how many estimates were replaced.
3. If it says nothing was sent, set the period on the page from the needed date
   through today, and click the bookmark again. The period must end today: the
   post always ends today, so a period that ends earlier would lose the estimates
   after its end. The run stops on such a period.
4. Run it again in about a quarter — it resumes from the oldest estimate.

## Maintenance

The scraping depends on Gudok's page markup (table class `.account-operations`,
`data-column-name` cells, `.load-more-btn`) and two page globals:
`window.goodok_daterangepicker` and `window.data_table_controller`. If Gudok
changes the page, adjust the selectors / date-range step in the source and
re-generate the bookmarklet. The server side (parsing, aggregation) is unaffected.

What the page did when checked on 2026-11-01:

- It opens on the last 14 days, whatever period `localStorage` holds.
- The table requests `goodok_daterangepicker.interval`. `set_current_date_interval`
  changes it, updates `#daterangepicker-text` (`DD.MM.YY – DD.MM.YY`) and reloads
  the table. It also saves the period in `localStorage`, under
  `history-goodok_date_interval`.
- "Показать ещё" asks for the whole list again, 10 rows longer. The button stays
  visible with the same text during the request, so only the table's `draw` event
  shows that rows arrived. `page.info().end` grows before they do.
