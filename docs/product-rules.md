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
- Estimates count in every `Сводка` figure like real rows: `Итог`, `Расходы` and `Прибыль по месяцам`. There is no filter and no second expense figure.
- `Сверено с Гудком до DD.MM` under `Расходы` says how far that figure is exact, for admin and user alike. The date is the period end of the last recorded run. With no recorded run it is the latest real `telephony` day, because the run of 2026-10-31 is not in the log. Estimates never set it. With neither date the label is hidden.
- `Звонки по городам` hides cities with zero calls in both windows and ranks the rest by this year's calls. Calls are the only per-city metric.

## `Прибыль по месяцам`

- Monthly profit = monthly revenue − monthly expenses.
- Every expense counts in the month it is dated. Annual hosting is not amortized.
- Future months of the current year show as empty, not zero.
- Monthly profits sum to the yearly profit shown in `Итог`.
- Average monthly profit divides by the months that have revenue or expense data, and compares with the same months of last year. With no comparable data the comparison is dropped, never divided by zero.

## Call counting

- Summary counts are unique first-time callers in the `calls` table, which holds webhook and CSV rows alike.
- A row is eligible only when its Gudok call number is 1 and it falls inside the window.
- Rows are deduplicated by the caller's phone number, so one caller counts once.
- Calls with no site are left out of every count.
- Storage is broader than counting: every webhook call is kept regardless of `callstatus`, with the full payload in `calls.raw`, and an unmatched call is stored with a null `siteId`.

## Number ownership

- A `phone_numbers` row belongs to one site, and its `siteId` may be empty. A site has one number at a time and any number over its history.
- The webhook sets the site only when it creates a number. After that `siteId` changes by hand only, so a project edit in Gudok cannot move calls.
- A call keeps its own `siteId`, so moving a number does not change past figures. An old number keeps its site, so old CSV rows still resolve.
- Numbers have no start or end dates. The active number is the one with the latest call.

## Calls CSV import

- CSV time is always read as `Europe/Moscow`, on any server.
- The number is found by `phone_numbers.name`, from the `Куда звонил` column.
- The match key is `siteId + src + callNumber`, compared strictly to the minute. Stored seconds are dropped, because CSV has none.
- Every row lands in one of three groups, and the result reports all three counts:
  - New: no stored call on the key. Written at once.
  - Duplicate: the key and minute match. Skipped, and the stored row stays unchanged.
  - Disputed: not written, and offered as a download with the reason in the `Причина` column.
- A row is disputed when the key matches with another minute, the number is unknown, the name fits several numbers, the number has no site, or the row is invalid.

## Money and portfolio

- A `Site` belongs to a `City`, and metrics and calls roll up to the city.
- A revenue or expense row with a null `siteId` is a company-level entry (`Общий`).
- Telephony expenses come from Gudok `/history`: only `Списание` rows count, summed into one `telephony` row per date and site.

## Auto charges

- Between Gudok runs the server writes an estimated `telephony` charge for each enabled schedule. The row has `is_estimate` set and no comment.
- In `Финансы` → `Расходы` an estimate shows the `оценка` mark, for admin and user alike. Estimates count in the table's row count and total like real rows.
- A check writes every date due up to today, then moves the next date past today by the schedule's interval, 30 days by default. Missed dates are written after downtime.
- Today is the `Europe/Moscow` day on any server.
- An estimate never changes a stored row: when the key `(date, siteId, type)` is taken, the row stays as it is and the date counts as done. A repeated check adds nothing.
- A number with no site is skipped and its next date stays. Once the number has a site, the missed dates are written.
- All schedules start off, and a number with no schedule has no auto charge.
- Auto charge is switched per number in `Филиалы` → `Номера`, by the admin. A user sees the tab with no controls.
- Switching on offers the site's last real `telephony` charge + 30 days and that charge's amount. Estimates are not counted, and the offer is worked out on each read, so switching on again never brings back old stored values. A site with no real charge offers nothing, and the admin fills in both fields.
- A switch-on is confirmed in a form, because rows written by a mistaken one stay until a reconciliation run. A next date in the past is allowed: the next check writes every date due since then.
- The next date must be a real `YYYY-MM-DD` date and the amount above zero. The interval is not edited: a stored interval below 1 is refused, because one bad schedule stops the check for all numbers. Switching off still works on such a schedule.
- A number with no site cannot be switched on. A site has one enabled number: a second one is refused, and the check runs inside the write transaction.
- Switching off stops new estimates. The schedule row stays, and rows already written stay until a reconciliation run.
- Switching on clears the stored no-charge period end. An edit keeps it.

## Reconciliation

- A run takes Gudok rows and the period they cover, and makes that period exact. A failed run changes nothing.
- Every `telephony` estimate dated inside the period, both ends included, is deleted first, so a real charge on another date cannot sit beside one. Estimates outside the period stay.
- Real rows are then written like any telephony sync. A row that replaces a deleted estimate reports `created`.
- Each enabled schedule takes its next date (last real charge + interval) and amount from the site's last real `telephony` charge, so a date shift or tariff change needs no edits. A site with no real charge at all keeps its values.
- A number stays on after a run with no real charge: only the admin switches it off. If its next date is now in the past, the hourly check writes estimates again.
- An enabled schedule stores the period's end when the period held an estimate for its site and no real charge. In every other case the stored value is cleared, so a short period with no charge due sets nothing.
- A disabled schedule is not changed.
- Every run goes in the reconciliation log, also with no rows. The result reports created, updated, skipped and deleted-estimate counts.

## Writing data

- Writes are idempotent. Calls CSV import never changes stored rows and skips duplicates, so re-uploading a file is safe. Webhooks key on `provider + providerCallId`.
- Manual entry, revenue and expense CSV import, and telephony sync overwrite the amount for the same key: revenue `(date, siteId)`, expenses `(date, siteId, type)`.
- Any real write on the expense key replaces an estimate and clears `is_estimate`, even at the same amount, and reports `updated`. This covers manual entry, expense CSV import and telephony sync. A repeated real write with the same amount reports `skipped`. The write's comment replaces the estimate's; with no comment the field is cleared, so estimate text never stays on a real row.
- Annual hosting is stored as `type = 'hosting'` dated `YYYY-01-01`.
- CSV import fails when required columns are missing or more than 50% of rows are invalid. A failed file writes nothing. Extra columns are allowed, because real Gudok exports carry more columns than we use. A calls import keeps the whole row in `calls.raw`.
- In revenue, expense and metrics CSVs a row is invalid when its date or amount can't be read or its `siteId` is not a stored site. An empty `siteId` means `Общий`, except in metrics, where it is required.
- Import, manual entry and other writes are admin-only. A write shows exactly one result toast; revalidation must not repeat it.

## Roles

- Two fixed roles: `ADMIN` and `USER`.
- Every signed-in user sees all dashboard widgets.
