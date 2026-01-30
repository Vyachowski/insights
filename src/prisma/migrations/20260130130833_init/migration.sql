-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "alt_names" JSONB,
    "url" TEXT NOT NULL,
    "revenue_share" DECIMAL(10,8),
    "priority" TEXT,
    "display_order" INTEGER,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
    "id" SERIAL NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "caller_number" TEXT NOT NULL,
    "region" TEXT,
    "project" TEXT,
    "destination" TEXT,
    "duration" INTEGER,
    "record_url" TEXT,
    "comment" TEXT,
    "call_completed" BOOLEAN,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityMonthlyMetric" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "yandex_users" INTEGER NOT NULL DEFAULT 0,
    "google_users" INTEGER NOT NULL DEFAULT 0,
    "visit_duration_yandex_in_sec" INTEGER NOT NULL DEFAULT 0,
    "visit_duration_google_in_sec" INTEGER NOT NULL DEFAULT 0,
    "bounce_yandex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_google" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leads_yandex" INTEGER NOT NULL DEFAULT 0,
    "leads_google" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CityMonthlyMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyRevenue" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "week_start" TIMESTAMP(3) NOT NULL,
    "revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,

    CONSTRAINT "WeeklyRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CityMonthlyMetric_city_id_month_key" ON "CityMonthlyMetric"("city_id", "month");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyRevenue_city_id_week_start_key" ON "WeeklyRevenue"("city_id", "week_start");

-- AddForeignKey
ALTER TABLE "CityMonthlyMetric" ADD CONSTRAINT "CityMonthlyMetric_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyRevenue" ADD CONSTRAINT "WeeklyRevenue_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;
