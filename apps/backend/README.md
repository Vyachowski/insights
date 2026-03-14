# Сервер приложения "Финансовый дашбоард для бизнеса"

Основные разделы:

- Достижение целей
- Финасовое здоровье
- Эффективность SEO
- Импорт данных

## Description

Проект решает задачу постановки целей для бизнеса, централизованной загрузки данных и еженедельного мониторинга показателей для владельца бизнеса и аналитика.

## Установка зависимостей

```bash
$ npm install
```

## Запуск проекта

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Запуск тестов

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Деплой

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Документация

Эндпойнты / документация

<!-- Сюда добавляем описание API эндпойнтов -->

GET /api/financial
GET /api/financial?year=2026

{
"weeklySummary": {
"week_start": "2026-02-03",
"week_end": "2026-02-09",
"profit": 35000,
"revenue": 120000,
"expenses": 85000,
"profitChange": 5
},
"monthlyComparison": {
"currentMonth": 140000,
"lastYear": 110000,
"change": 27
},
"yearlyTrend": [
{ "week": "Нед 1", "current": 28000, "previous": 22000 },
{ "week": "Нед 2", "current": 31000, "previous": 25000 },
{ "week": "Нед 3", "current": 29000, "previous": 23000 },
{ "week": "Нед 4", "current": 33000, "previous": 26000 }
// ... дальше по неделям
],
"citiesProfit": [
{ "city": "Москва", "profit": 45000 },
{ "city": "Санкт-Петербург", "profit": 32000 },
{ "city": "Казань", "profit": 18000 },
{ "city": "Новосибирск", "profit": 15000 },
{ "city": "Екатеринбург", "profit": 12000 }
],
"businessHealth": {
"isGrowing": true,
"avgCurrent": 35500,
"avgPrevious": 29500,
"growthPercent": 20
}
}

Описание полей:

weeklySummary — данные за последнюю неделю (прибыль, выручка, расходы, изменение прибыли).

monthlyComparison — прибыль текущего месяца и того же месяца прошлого года + Δ%.

yearlyTrend — недельная прибыль текущего и прошлого года.

citiesProfit — прибыль по городам выбранного года.

businessHealth — итоговое состояние бизнеса (растёт / падает), средние недельные показатели и процент роста.

## Список дальнейших улучшений

<!-- - Подробная инструкция по запуску и настройке окружения - Скриншоты или GIF работы дашборда - Структура проекта (папки, компоненты) - Как внести изменения / разработка - Лицензия -->

## Контакты

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
