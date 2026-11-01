# Gudok telephony console script

Reconciles telephony expenses with Gudok. The server writes estimated charges;
this run brings the real ones and replaces the estimates of the period. Run it
about once a quarter.

Gudok has no API or export, so the script runs inside your own signed-in session.
Your Gudok login and the secret are stored nowhere.

## Run

1. Copy the script. Plain `pbcopy` corrupts Cyrillic:

   ```bash
   LC_ALL=en_US.UTF-8 pbcopy < scripts/gudok-telephony-console.js
   ```

2. Sign in to Gudok and open `https://in.gudok.tel/history`.
3. Open the console, paste the script and press Enter.
4. Enter the value of `GUDOK_WEBHOOK_SECRET`.

The file needs no edits and no build. A repeated run is safe: it overwrites and
never duplicates.

## What it does

1. Asks for the secret. Cancel ends the run.
2. Reads the whole history from `/history.json`: `dates[]` twice, `01.01.2015` and
   today, `start=0`, `length=10000`.
3. Posts the reply as it is to `POST /webhooks/gudok/expenses/<secret>`.

The server checks every row, picks the period and writes. The rules are in
`docs/product-rules.md`, under Gudok's reply. A change in Gudok's data is fixed
by a deploy, with no new script.

## Messages

| Message | Meaning |
|---|---|
| `Войдите в Гудок` | The session ended |
| `Нет связи с Гудком` | Gudok did not answer |
| `Гудок ответил не JSON: HTTP N. Скрипт пора обновить` | `/history.json` moved or changed: the script needs a fix |
| `Нет связи с Insights: проверьте сеть и адрес в скрипте` | Insights did not answer |
| `Неверный секрет` | Insights returned 404 |
| `Insights не принял запрос: HTTP N` | Insights failed with no readable reason |
| `Гудок изменился: ...` | The server refused a row, nothing was written: the check needs a fix |

Gudok's service worker answers any failed fetch with `offline/offline.html` as a
200, also for a request to another site. The script reads that page as no
connection, for both Gudok and Insights.
