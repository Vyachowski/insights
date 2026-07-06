CREATE TABLE `call_imports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer NOT NULL,
	`date` integer NOT NULL,
	`src` text NOT NULL,
	`region` text,
	`call_number` integer NOT NULL,
	`class` text,
	`project_title` text NOT NULL,
	`adv_channel_name` text NOT NULL,
	`billsec` integer NOT NULL,
	`comment` text,
	`redirect_number` text,
	`source` text DEFAULT 'csv' NOT NULL,
	`imported_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `call_imports_site_id_idx` ON `call_imports` (`site_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `call_imports_site_id_date_src_call_number_key` ON `call_imports` (`site_id`,`date`,`src`,`call_number`);--> statement-breakpoint
CREATE TABLE `calls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer NOT NULL,
	`gudok_id` integer NOT NULL,
	`project_id` integer NOT NULL,
	`project_title` text NOT NULL,
	`dst` text NOT NULL,
	`adv_channel_id` text NOT NULL,
	`adv_channel_name` text NOT NULL,
	`src` text NOT NULL,
	`duration` integer NOT NULL,
	`billsec` integer NOT NULL,
	`callstatus` text NOT NULL,
	`date` integer NOT NULL,
	`region` text NOT NULL,
	`call_number` integer NOT NULL,
	`audio` text NOT NULL,
	`source` text DEFAULT 'webhook' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `calls_gudok_id_unique` ON `calls` (`gudok_id`);--> statement-breakpoint
CREATE INDEX `calls_site_id_idx` ON `calls` (`site_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `calls_site_id_date_src_key` ON `calls` (`site_id`,`date`,`src`);--> statement-breakpoint
CREATE TABLE `cities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`population` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_code_unique` ON `cities` (`code`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer,
	`date` text NOT NULL,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`comment` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `expenses_date_idx` ON `expenses` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_date_site_id_type_key` ON `expenses` (`date`,`site_id`,`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_date_type_null_site_idx` ON `expenses` (`date`,`type`) WHERE site_id IS NULL;--> statement-breakpoint
CREATE TABLE `revenues` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer,
	`date` text NOT NULL,
	`amount` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `revenues_date_idx` ON `revenues` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `revenues_date_site_id_key` ON `revenues` (`date`,`site_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `revenue_date_null_site_idx` ON `revenues` (`date`) WHERE site_id IS NULL;--> statement-breakpoint
CREATE TABLE `site_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer NOT NULL,
	`date` text NOT NULL,
	`yandex_users` integer DEFAULT 0 NOT NULL,
	`google_users` integer DEFAULT 0 NOT NULL,
	`other_users` integer DEFAULT 0 NOT NULL,
	`visit_duration_yandex_in_sec` real DEFAULT 0 NOT NULL,
	`visit_duration_google_in_sec` real DEFAULT 0 NOT NULL,
	`visit_duration_other_in_sec` real DEFAULT 0 NOT NULL,
	`bounce_yandex` real DEFAULT 0 NOT NULL,
	`bounce_google` real DEFAULT 0 NOT NULL,
	`bounce_other` real DEFAULT 0 NOT NULL,
	`leads_yandex` integer DEFAULT 0 NOT NULL,
	`leads_google` integer DEFAULT 0 NOT NULL,
	`leads_other` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_metrics_site_id_date_key` ON `site_metrics` (`site_id`,`date`);--> statement-breakpoint
CREATE INDEX `site_metrics_date_idx` ON `site_metrics` (`date`);--> statement-breakpoint
CREATE TABLE `sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city_id` integer NOT NULL,
	`name` text,
	`group` text,
	`url` text NOT NULL,
	`yandex_counter_id` text NOT NULL,
	`google_counter_id` text,
	`yandex_tag_manager_id` text,
	`google_tag_manager_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sites_city_id_idx` ON `sites` (`city_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'USER' NOT NULL,
	`first_name` text,
	`last_name` text,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);