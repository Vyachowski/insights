CREATE TABLE `hostings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`account` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hostings_provider_account_key` ON `hostings` (`provider`,`account`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer,
	`hosting_id` integer,
	`date` text NOT NULL,
	`amount` integer NOT NULL,
	`type` text NOT NULL,
	`comment` text,
	`is_estimate` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`hosting_id`) REFERENCES `hostings`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "expenses_site_or_hosting_check" CHECK(site_id IS NULL OR hosting_id IS NULL)
);
--> statement-breakpoint
INSERT INTO `__new_expenses`("id", "site_id", "hosting_id", "date", "amount", "type", "comment", "is_estimate", "created_at", "updated_at") SELECT "id", "site_id", NULL, "date", "amount", "type", "comment", "is_estimate", "created_at", "updated_at" FROM `expenses`;--> statement-breakpoint
DROP TABLE `expenses`;--> statement-breakpoint
ALTER TABLE `__new_expenses` RENAME TO `expenses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `expenses_date_idx` ON `expenses` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_date_site_id_type_key` ON `expenses` (`date`,`site_id`,`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_date_type_null_site_idx` ON `expenses` (`date`,`type`) WHERE site_id IS NULL AND hosting_id IS NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `expenses_date_hosting_id_key` ON `expenses` (`date`,`hosting_id`) WHERE hosting_id IS NOT NULL;--> statement-breakpoint
CREATE TABLE `__new_charge_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text,
	`provider_number_id` text,
	`hosting_id` integer,
	`enabled` integer DEFAULT false NOT NULL,
	`next_date` text NOT NULL,
	`amount` integer NOT NULL,
	`interval_days` integer DEFAULT 30,
	`interval_months` integer,
	`no_charge_period_end` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`hosting_id`) REFERENCES `hostings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`provider`,`provider_number_id`) REFERENCES `phone_numbers`(`provider`,`provider_number_id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "charge_schedules_shape_check" CHECK(
      (provider IS NOT NULL AND provider_number_id IS NOT NULL AND interval_days IS NOT NULL
        AND hosting_id IS NULL AND interval_months IS NULL)
      OR (provider IS NULL AND provider_number_id IS NULL AND interval_days IS NULL
        AND hosting_id IS NOT NULL AND interval_months IS NOT NULL AND interval_months >= 1)
    )
);
--> statement-breakpoint
INSERT INTO `__new_charge_schedules`("id", "provider", "provider_number_id", "hosting_id", "enabled", "next_date", "amount", "interval_days", "interval_months", "no_charge_period_end", "created_at", "updated_at") SELECT "id", "provider", "provider_number_id", NULL, "enabled", "next_date", "amount", "interval_days", NULL, "no_charge_period_end", "created_at", "updated_at" FROM `charge_schedules`;--> statement-breakpoint
DROP TABLE `charge_schedules`;--> statement-breakpoint
ALTER TABLE `__new_charge_schedules` RENAME TO `charge_schedules`;--> statement-breakpoint
CREATE UNIQUE INDEX `charge_schedules_provider_provider_number_id_key` ON `charge_schedules` (`provider`,`provider_number_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `charge_schedules_hosting_id_key` ON `charge_schedules` (`hosting_id`);--> statement-breakpoint
ALTER TABLE `sites` ADD `hosting_id` integer REFERENCES hostings(id) ON DELETE set null;--> statement-breakpoint
INSERT INTO `hostings` (`provider`, `account`, `created_at`, `updated_at`)
VALUES ('sprinthost', 'a0181620', CAST(unixepoch('subsec') * 1000 AS INTEGER), CAST(unixepoch('subsec') * 1000 AS INTEGER));
--> statement-breakpoint
UPDATE `sites` SET `hosting_id` = (SELECT `id` FROM `hostings` WHERE `provider` = 'sprinthost' AND `account` = 'a0181620');
--> statement-breakpoint
UPDATE `expenses` SET `hosting_id` = (SELECT `id` FROM `hostings` WHERE `provider` = 'sprinthost' AND `account` = 'a0181620')
WHERE `type` = 'hosting' AND `site_id` IS NULL;
