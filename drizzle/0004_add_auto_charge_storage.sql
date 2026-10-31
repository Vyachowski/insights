CREATE TABLE `charge_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider` text NOT NULL,
	`provider_number_id` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`next_date` text NOT NULL,
	`amount` integer NOT NULL,
	`interval_days` integer DEFAULT 30 NOT NULL,
	`no_charge_period_end` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`provider`,`provider_number_id`) REFERENCES `phone_numbers`(`provider`,`provider_number_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `charge_schedules_provider_provider_number_id_key` ON `charge_schedules` (`provider`,`provider_number_id`);--> statement-breakpoint
CREATE TABLE `reconciliation_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`ran_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `expenses` ADD `is_estimate` integer DEFAULT false NOT NULL;