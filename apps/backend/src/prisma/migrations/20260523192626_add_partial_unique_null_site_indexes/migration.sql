-- Partial unique index for expenses where site_id IS NULL
-- Complements @@unique([date, siteId, type]) which doesn't protect NULL siteId in PostgreSQL
CREATE UNIQUE INDEX "expenses_date_type_null_site_idx"
  ON "expenses" ("date", "type")
  WHERE "site_id" IS NULL;

-- Partial unique index for revenue where site_id IS NULL
-- Complements @@unique([date, siteId]) which doesn't protect NULL siteId in PostgreSQL
CREATE UNIQUE INDEX "revenue_date_null_site_idx"
  ON "revenues" ("date")
  WHERE "site_id" IS NULL;