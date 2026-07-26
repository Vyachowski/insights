## 1. Серверная логика

- [x] 1.1 В `app/server/expenses/` добавить константу `HOSTING_TYPE = 'hosting'` (рядом с `TELEPHONY_TYPE`).
- [x] 1.2 Вынести идемпотентный upsert-хелпер `upsertExpense({ date, siteId, type, amount })` (совпадение по `(date, siteId, type)` → no-op / update / insert), переиспользуя логику из `app/server/imports/index.ts`.
- [x] 1.3 Написать unit-тест на `upsertExpense`: insert новой, update при другой сумме, no-op при той же сумме, ветка `siteId = null`.

## 2. Роут расходов (`finance.tsx`)

- [x] 2.1 Добавить `action`: `requireAdmin`, разбор формы (`intent=add-hosting`, `year`, `siteId`, `amount`), дата `YYYY-01-01`, сумма → копейки, вызов `upsertExpense` с `type=HOSTING_TYPE`.
- [x] 2.2 Валидация ввода на сервере: год и положительная сумма обязательны; при ошибке вернуть 400 с сообщением.
- [x] 2.3 На вкладке «Расходы» подключить состояние модалки и ревалидацию после успешного добавления (`useFetcher`/`useRevalidator`); пробросить `isAdmin` в `ExpensesTabView`.

## 3. UI

- [x] 3.1 Создать `app/modules/data/AddHostingModal.tsx` по образцу `AddRevenueModal`: `YearSelect` (год), `Select` сайта («Общий (компания)» = null), `Input` суммы; тип скрыт/захардкожен `hosting`; клиентская валидация года и суммы > 0.
- [x] 3.2 В `ExpensesTabView` добавить кнопку «Добавить» (как в доходах) рядом с «Импорт CSV», видимую только при `isAdmin`; проп `onAddClick`.
- [x] 3.3 Подключить `AddHostingModal` в `finance.tsx`, отправка через `action`, короткий toast «создано»/«обновлено» по результату.

## 4. Проверка

- [x] 4.1 `npm run typecheck`, `npm run lint`, `npm test` — зелёные.
- [x] 4.2 Ручная проверка: добавить хостинг за год для сайта и для «Общий»; повтор за тот же год перезаписывает сумму; не-админ не видит кнопку.
