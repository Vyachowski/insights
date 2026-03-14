-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "first_name" TEXT,
    "last_name" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" TEXT,
    "group" TEXT,
    "url" TEXT NOT NULL,
    "yandex_counter_id" TEXT NOT NULL,
    "google_counter_id" TEXT,
    "yandex_tag_manager_id" TEXT,
    "google_tag_manager_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_metrics" (
    "id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "yandex_users" INTEGER NOT NULL DEFAULT 0,
    "google_users" INTEGER NOT NULL DEFAULT 0,
    "other_users" INTEGER NOT NULL DEFAULT 0,
    "visit_duration_yandex_in_sec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "visit_duration_google_in_sec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "visit_duration_other_in_sec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_yandex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_google" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_other" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leads_yandex" INTEGER NOT NULL DEFAULT 0,
    "leads_google" INTEGER NOT NULL DEFAULT 0,
    "leads_other" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "site_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_imports" (
    "id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "src" TEXT NOT NULL,
    "region" TEXT,
    "call_number" INTEGER NOT NULL,
    "class" TEXT,
    "project_title" TEXT NOT NULL,
    "adv_channel_name" TEXT NOT NULL,
    "billsec" INTEGER NOT NULL,
    "comment" TEXT,
    "redirect_number" TEXT,
    "source" TEXT NOT NULL DEFAULT 'csv',
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "call_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" SERIAL NOT NULL,
    "site_id" INTEGER NOT NULL,
    "gudok_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "project_title" TEXT NOT NULL,
    "dst" TEXT NOT NULL,
    "adv_channel_id" TEXT NOT NULL,
    "adv_channel_name" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "billsec" INTEGER NOT NULL,
    "callstatus" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "region" TEXT NOT NULL,
    "call_number" INTEGER NOT NULL,
    "audio" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'webhook',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenues" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "sites_city_id_idx" ON "sites"("city_id");

-- CreateIndex
CREATE INDEX "site_metrics_date_idx" ON "site_metrics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "site_metrics_site_id_date_key" ON "site_metrics"("site_id", "date");

-- CreateIndex
CREATE INDEX "call_imports_site_id_idx" ON "call_imports"("site_id");

-- CreateIndex
CREATE UNIQUE INDEX "calls_gudok_id_key" ON "calls"("gudok_id");

-- CreateIndex
CREATE INDEX "calls_site_id_idx" ON "calls"("site_id");

-- CreateIndex
CREATE INDEX "revenues_date_idx" ON "revenues"("date");

-- CreateIndex
CREATE INDEX "expenses_date_idx" ON "expenses"("date");

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_metrics" ADD CONSTRAINT "site_metrics_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_imports" ADD CONSTRAINT "call_imports_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
