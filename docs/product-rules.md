# Product rules

Rules the code cannot explain on its own. UI labels stay in Russian, exactly as the app shows them.

## Comparison model (`Сводка`)

- Every summary widget compares this year's window (Jan 1 → today) with the same calendar window of last year.
- Parity with last year's window is 100%. Last year's full-year total is never the reference, so a mid-year metric is not pushed below 100% just because the year is incomplete.
- Each widget has a `%` · `абс.` toggle, default `%`.
- `абс.` is the signed average monthly year-over-year difference: (this year's total − last year's total) ÷ elapsed months, with a `/мес` suffix. It is never a cumulative total.
- All widgets use the same elapsed-months definition, so their monthly figures are comparable.

## Year-over-year label

- Last year's value is non-zero: signed rounded percent, then the year (`+12% к 2025`). The year comes from the current date.
- Last year's value is zero and this year's is not: `новый`, not `0%`.
- Both values are zero: `—`.

## `Итог`

- `Бизнес растёт` or `Бизнес падает`, based on average weekly profit year over year.
- `сильно` is added when the absolute swing is at least 20%.
- The hero number's sign and color always agree: negative is `−` and red, positive is `+` and teal.

## `Тренды` and `Звонки по городам`

- The bar has a target line at last year's same-window level. It is red below the line and green at or past it.
- `Расходы` is inverted: green below the line, red past it.
- Profit stays out of `Тренды`; it belongs to `Итог`.
- `Звонки по городам` hides cities with zero calls in both windows and ranks the rest by this year's calls. Calls are the only per-city metric.

## `Прибыль по месяцам`

- Monthly profit = monthly revenue − monthly expenses.
- Every expense counts in the month it is dated. Annual hosting is not amortized.
- Future months of the current year show as empty, not zero.
- Monthly profits sum to the yearly profit shown in `Итог`.
- Average monthly profit divides by the months that have revenue or expense data, and compares with the same months of last year. With no comparable data the comparison is dropped, never divided by zero.

## Call counting

- Summary counts are unique first-time callers across imported and webhook calls.
- A row is eligible only when its Gudok call number is 1 and it falls inside the window.
- Rows from both sources are deduplicated by phone number, so one number counts once.
- Webhook calls with no matched site are left out of every count.
- Storage is broader than counting: every webhook call is kept regardless of `callstatus`, with the full payload in `calls.raw`, and an unmatched call is stored with a null `siteId`.

## Money and portfolio

- A `Site` belongs to a `City`, and metrics and calls roll up to the city.
- A revenue or expense row with a null `siteId` is a company-level entry (`Общий`).
- Telephony expenses come from Gudok `/history`: only `Списание` rows count, summed into one `telephony` row per date and site.

## Writing data

- Writes are idempotent. CSV import skips duplicates, webhooks key on `gudokId`.
- Manual entry and telephony sync overwrite the amount for the same key: revenue `(date, siteId)`, expenses `(date, siteId, type)`.
- Annual hosting is stored as `type = 'hosting'` dated `YYYY-01-01`.
- CSV import fails when required columns are missing or more than 50% of rows are invalid. Extra columns are ignored, because real Gudok exports carry more columns than we use.
- Import, manual entry and other writes are admin-only. A write shows exactly one result toast; revalidation must not repeat it.

## Roles

- Two fixed roles: `ADMIN` and `USER`.
- Every signed-in user sees all dashboard widgets.
