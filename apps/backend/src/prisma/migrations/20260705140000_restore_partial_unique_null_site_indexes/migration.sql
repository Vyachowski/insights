-- Restore partial unique indexes lost in the migration squash (originally f802dd2).
-- Composite unique (date, site_id) treats NULL site_id rows as always-distinct,
-- so company-level entries need their own partial unique guards.
CREATE UNIQUE INDEX "expenses_date_type_null_site_idx"
  ON "expenses" ("date", "type")
  WHERE "site_id" IS NULL;

CREATE UNIQUE INDEX "revenue_date_null_site_idx"
  ON "revenues" ("date")
  WHERE "site_id" IS NULL;
