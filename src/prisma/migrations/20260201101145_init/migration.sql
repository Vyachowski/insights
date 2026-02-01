-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "yandex_counter_id" TEXT,
    "google_counter_id" TEXT,
    "yandex_tag_manager_id" TEXT,
    "google_tag_manager_id" TEXT,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteMetric" (
    "id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "yandex_users" INTEGER NOT NULL DEFAULT 0,
    "google_users" INTEGER NOT NULL DEFAULT 0,
    "other_users" INTEGER NOT NULL DEFAULT 0,
    "visit_duration_yandex_in_sec" INTEGER NOT NULL DEFAULT 0,
    "visit_duration_google_in_sec" INTEGER NOT NULL DEFAULT 0,
    "visit_duration_other_in_sec" INTEGER NOT NULL DEFAULT 0,
    "bounce_yandex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_google" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_other" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leads_yandex" INTEGER NOT NULL DEFAULT 0,
    "leads_google" INTEGER NOT NULL DEFAULT 0,
    "leads_other" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteMetric_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Revenue" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Site_city_id_idx" ON "Site"("city_id");

-- CreateIndex
CREATE INDEX "SiteMetric_date_idx" ON "SiteMetric"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SiteMetric_site_id_date_key" ON "SiteMetric"("site_id", "date");

-- CreateIndex
CREATE INDEX "Call_city_id_idx" ON "Call"("city_id");

-- CreateIndex
CREATE INDEX "Call_date_time_idx" ON "Call"("date_time");

-- CreateIndex
CREATE INDEX "Revenue_date_idx" ON "Revenue"("date");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteMetric" ADD CONSTRAINT "SiteMetric_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
