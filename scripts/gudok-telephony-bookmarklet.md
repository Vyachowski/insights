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
2. Leaves the page's date range alone if it already starts on or before that day.
   Otherwise it tries to widen the range. Then it loads the rows (clicks
   "Показать ещё" only as far back as needed — not to the bottom every time).
3. Checks that it reached the start date. It did if a loaded row is older than
   that date, or if the page's own range starts on or before it and the list is
   fully loaded: a day may have no operations. Anything else stops the run with a
   message that names the needed date and the loaded date, and nothing is posted.
4. Posts the `Списание` (charge) rows dated inside the period to
   `POST /webhooks/gudok/expenses/<secret>`, with
   `period: { start, end }` in `YYYY-MM-DD`: the start date and today, by the
   browser's local date. A run with no charges still posts the empty list and the
   period.
5. The server deletes the estimates inside the period, groups charges per
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
2. Click the bookmark. It reports how many charges were created/updated/skipped
   and how many estimates were replaced.
3. If it says nothing was sent, set the period on the page from the needed date
   through today, and click the bookmark again. The period must end today: the
   run treats everything up to today as checked, so a period that ends earlier
   loses the estimates after its end.
4. Run it again in about a quarter — it resumes from the oldest estimate.

## Maintenance

The scraping depends on Gudok's page markup (table class `.account-operations`,
`data-column-name` cells, `.load-more-btn`, the date-range picker globals). If
Gudok changes the page, adjust the selectors / date-range step in the source and
re-generate the bookmarklet. The server side (parsing, aggregation) is unaffected.

The automatic range step did not work on the live page on 2026-10-31: it loaded
rows from 2026-10-17 only. Until that is fixed, expect to set the period by hand.
The stop keeps such a run from posting.
