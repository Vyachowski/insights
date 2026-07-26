PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_calls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer,
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
	`raw` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_calls`("id", "site_id", "gudok_id", "project_id", "project_title", "dst", "adv_channel_id", "adv_channel_name", "src", "duration", "billsec", "callstatus", "date", "region", "call_number", "audio", "source", "created_at", "updated_at") SELECT "id", "site_id", "gudok_id", "project_id", "project_title", "dst", "adv_channel_id", "adv_channel_name", "src", "duration", "billsec", "callstatus", "date", "region", "call_number", "audio", "source", "created_at", "updated_at" FROM `calls`;--> statement-breakpoint
DROP TABLE `calls`;--> statement-breakpoint
ALTER TABLE `__new_calls` RENAME TO `calls`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `calls_gudok_id_unique` ON `calls` (`gudok_id`);--> statement-breakpoint
CREATE INDEX `calls_site_id_idx` ON `calls` (`site_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `calls_site_id_date_src_key` ON `calls` (`site_id`,`date`,`src`);