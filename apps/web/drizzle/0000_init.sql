CREATE TYPE "public"."Role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."UserStatus" AS ENUM('ACTIVE', 'DEACTIVATED');--> statement-breakpoint
CREATE TABLE "call_imports" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"date" timestamp (3) NOT NULL,
	"src" text NOT NULL,
	"region" text,
	"call_number" integer NOT NULL,
	"class" text,
	"project_title" text NOT NULL,
	"adv_channel_name" text NOT NULL,
	"billsec" integer NOT NULL,
	"comment" text,
	"redirect_number" text,
	"source" text DEFAULT 'csv' NOT NULL,
	"imported_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"gudok_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"project_title" text NOT NULL,
	"dst" text NOT NULL,
	"adv_channel_id" text NOT NULL,
	"adv_channel_name" text NOT NULL,
	"src" text NOT NULL,
	"duration" integer NOT NULL,
	"billsec" integer NOT NULL,
	"callstatus" text NOT NULL,
	"date" timestamp (3) NOT NULL,
	"region" text NOT NULL,
	"call_number" integer NOT NULL,
	"audio" text NOT NULL,
	"source" text DEFAULT 'webhook' NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "calls_gudok_id_unique" UNIQUE("gudok_id")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"population" integer NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "cities_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer,
	"date" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"type" text NOT NULL,
	"comment" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revenues" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer,
	"date" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"date" date NOT NULL,
	"yandex_users" integer DEFAULT 0 NOT NULL,
	"google_users" integer DEFAULT 0 NOT NULL,
	"other_users" integer DEFAULT 0 NOT NULL,
	"visit_duration_yandex_in_sec" double precision DEFAULT 0 NOT NULL,
	"visit_duration_google_in_sec" double precision DEFAULT 0 NOT NULL,
	"visit_duration_other_in_sec" double precision DEFAULT 0 NOT NULL,
	"bounce_yandex" double precision DEFAULT 0 NOT NULL,
	"bounce_google" double precision DEFAULT 0 NOT NULL,
	"bounce_other" double precision DEFAULT 0 NOT NULL,
	"leads_yandex" integer DEFAULT 0 NOT NULL,
	"leads_google" integer DEFAULT 0 NOT NULL,
	"leads_other" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"city_id" integer NOT NULL,
	"name" text,
	"group" text,
	"url" text NOT NULL,
	"yandex_counter_id" text NOT NULL,
	"google_counter_id" text,
	"yandex_tag_manager_id" text,
	"google_tag_manager_id" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "Role" DEFAULT 'USER' NOT NULL,
	"first_name" text,
	"last_name" text,
	"status" "UserStatus" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "call_imports" ADD CONSTRAINT "call_imports_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calls" ADD CONSTRAINT "calls_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenues" ADD CONSTRAINT "revenues_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_metrics" ADD CONSTRAINT "site_metrics_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "call_imports_site_id_idx" ON "call_imports" USING btree ("site_id");--> statement-breakpoint
CREATE UNIQUE INDEX "call_imports_site_id_date_src_call_number_key" ON "call_imports" USING btree ("site_id","date","src","call_number");--> statement-breakpoint
CREATE INDEX "calls_site_id_idx" ON "calls" USING btree ("site_id");--> statement-breakpoint
CREATE UNIQUE INDEX "calls_site_id_date_src_key" ON "calls" USING btree ("site_id","date","src");--> statement-breakpoint
CREATE INDEX "expenses_date_idx" ON "expenses" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "expenses_date_site_id_type_key" ON "expenses" USING btree ("date","site_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "expenses_date_type_null_site_idx" ON "expenses" USING btree ("date","type") WHERE "expenses"."site_id" IS NULL;--> statement-breakpoint
CREATE INDEX "revenues_date_idx" ON "revenues" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "revenues_date_site_id_key" ON "revenues" USING btree ("date","site_id");--> statement-breakpoint
CREATE UNIQUE INDEX "revenue_date_null_site_idx" ON "revenues" USING btree ("date") WHERE "revenues"."site_id" IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "site_metrics_site_id_date_key" ON "site_metrics" USING btree ("site_id","date");--> statement-breakpoint
CREATE INDEX "site_metrics_date_idx" ON "site_metrics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "sites_city_id_idx" ON "sites" USING btree ("city_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");