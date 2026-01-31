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
    "city_id" INTEGER NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "caller_number" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "call_order" INTEGER NOT NULL,
    "class" TEXT,
    "number_name" TEXT,
    "project" TEXT NOT NULL,
    "duration_in_sec" INTEGER,
    "comment" TEXT,
    "redirect_number" TEXT,

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
CREATE TABLE "Revenue" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "active_cities" INTEGER NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CityMonthlyMetric_city_id_month_key" ON "CityMonthlyMetric"("city_id", "month");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityMonthlyMetric" ADD CONSTRAINT "CityMonthlyMetric_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
