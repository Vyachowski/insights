-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "firstName" TEXT,
    "lastName" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER NOT NULL,
    "name" TEXT,
    "group" TEXT,
    "url" TEXT NOT NULL,
    "yandex_counter_id" TEXT NOT NULL,
    "google_counter_id" TEXT,
    "yandex_tag_manager_id" TEXT,
    "google_tag_manager_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "visit_duration_yandex_in_sec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "visit_duration_google_in_sec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "visit_duration_other_in_sec" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_yandex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_google" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bounce_other" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leads_yandex" INTEGER NOT NULL DEFAULT 0,
    "leads_google" INTEGER NOT NULL DEFAULT 0,
    "leads_other" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SiteMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallImport" (
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

    CONSTRAINT "CallImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Call" (
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

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" SERIAL NOT NULL,
    "city_id" INTEGER,
    "date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Site_city_id_idx" ON "Site"("city_id");

-- CreateIndex
CREATE INDEX "SiteMetric_date_idx" ON "SiteMetric"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SiteMetric_site_id_date_key" ON "SiteMetric"("site_id", "date");

-- CreateIndex
CREATE INDEX "CallImport_site_id_idx" ON "CallImport"("site_id");

-- CreateIndex
CREATE UNIQUE INDEX "Call_gudok_id_key" ON "Call"("gudok_id");

-- CreateIndex
CREATE INDEX "Call_site_id_idx" ON "Call"("site_id");

-- CreateIndex
CREATE INDEX "Revenue_date_idx" ON "Revenue"("date");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteMetric" ADD CONSTRAINT "SiteMetric_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallImport" ADD CONSTRAINT "CallImport_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
