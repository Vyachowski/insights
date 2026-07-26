# Gudok telephony expense bookmarklet

Collects Gudok number-renewal charges (телефония) from the Gudok operations page
and imports them into the Insights `expenses` table as `type = 'telephony'`.
Gudok has no API or export, so this scrapes the page inside your own logged-in
session. No Gudok credentials are stored anywhere.

## How it works

1. Asks the app `GET /webhooks/gudok/expenses/<secret>/since` for the latest day
   already stored.
2. Widens the operations date range back to that day (inclusive) and loads the
   in-range rows (clicks "Показать ещё" only as far back as needed — not to the
   bottom every time).
3. Scrapes the `Списание` (charge) rows and posts them to
   `POST /webhooks/gudok/expenses/<secret>`.
4. The server groups charges per (day, city→site), sums them, and upserts one
   `telephony` expense per group. Re-running is safe — it overwrites, never
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
2. Click the bookmark. It reports how many charges were created/updated/skipped.
3. Run it again next month — it resumes from the last stored day.

## Maintenance

The scraping depends on Gudok's page markup (table class `.account-operations`,
`data-column-name` cells, `.load-more-btn`, the date-range picker globals). If
Gudok changes the page, adjust the selectors / date-range step in the source and
re-generate the bookmarklet. The server side (parsing, aggregation) is unaffected.
