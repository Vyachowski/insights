ALTER TABLE `sites` ADD `gudok_project_id` integer;
--> statement-breakpoint
DROP INDEX `calls_gudok_id_unique`;
--> statement-breakpoint
DROP INDEX `calls_site_id_idx`;
--> statement-breakpoint
DROP INDEX `calls_site_id_date_src_key`;
--> statement-breakpoint
DROP INDEX `call_imports_site_id_idx`;
--> statement-breakpoint
DROP INDEX `call_imports_site_id_date_src_call_number_key`;
--> statement-breakpoint
ALTER TABLE `calls` RENAME TO `calls_old`;
--> statement-breakpoint
ALTER TABLE `call_imports` RENAME TO `call_imports_old`;
--> statement-breakpoint
CREATE TABLE `phone_numbers` (
	`provider` text NOT NULL,
	`provider_number_id` text NOT NULL,
	`number` text,
	`site_id` integer,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`provider`, `provider_number_id`),
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `phone_numbers_number_unique` ON `phone_numbers` (`number`);
--> statement-breakpoint
CREATE INDEX `phone_numbers_site_id_idx` ON `phone_numbers` (`site_id`);
--> statement-breakpoint
CREATE TABLE `calls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`site_id` integer,
	`provider` text NOT NULL,
	`provider_number_id` text,
	`provider_call_id` text,
	`src` text NOT NULL,
	`call_number` integer NOT NULL,
	`date` integer NOT NULL,
	`callstatus` text,
	`billsec` integer,
	`region` text,
	`source` text NOT NULL,
	`raw` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `calls_site_id_idx` ON `calls` (`site_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `calls_provider_provider_call_id_key` ON `calls` (`provider`,`provider_call_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `calls_site_id_src_call_number_date_key` ON `calls` (`site_id`,`src`,`call_number`,`date`);
--> statement-breakpoint
CREATE TABLE `__calls_number_seed` (
	`site_id` integer NOT NULL,
	`project_id` integer,
	`provider_number_id` text NOT NULL,
	`number` text,
	`name` text NOT NULL
);
--> statement-breakpoint
-- Fixed list from the Gudok projects response and prod counts, 2026-10-30.
INSERT INTO `__calls_number_seed` VALUES
	(1, 8171, '4635', '78463794173', 'Самара'),
	(2, 8184, '4255', '78482943075', 'Тольятти'),
	(3, 8374, '6449', '73833181047', 'Новосибирск'),
	(4, 10368, '6914', '74732051158', 'Воронеж'),
	(5, 8185, '4256', '73472261546', 'Уфа'),
	(6, 8913, '6019', '73512101443', 'Челябинск'),
	(7, 10323, '6894', '73812297855', 'Омск'),
	(8, 8925, '5264', '78442606954', 'Волгоград'),
	(9, 15656, '11193', '78125027091', 'Санкт-Петербург'),
	(10, 10370, '6915', '78312004584', 'Нижний Новгород'),
	(11, 8265, '7077', '73433123928', 'Екатеринбург'),
	(12, 17224, '12401', '78452427602', 'Саратов'),
	(13, 17225, '12402', '74852675139', 'Ярославль'),
	(14, 17226, '12403', '73412326054', 'Ижевск'),
	(15, 10290, '11321', '78432100417', 'Казань'),
	(16, 17227, '12404', '73822281476', 'Томск'),
	(17, 15778, '20395', '78632049553', 'Ростов-На-Дону'),
	(18, 15786, '20396', '73912759976', 'Красноярск'),
	(19, 31910, 'csv:78422291842', '78422291842', 'Ульяновск'),
	(1, NULL, 'csv:ses-samara', NULL, 'СЭС – Самара'),
	(3, NULL, 'csv:ses-novosibirsk', NULL, 'СЭС – Новосибирск'),
	(6, NULL, 'csv:ses-chelyabinsk', NULL, 'СЭС – Челябинск'),
	(11, NULL, 'csv:ses-ekaterinburg', NULL, 'СЭС – Екат'),
	(15, NULL, 'csv:ses-kazan', NULL, 'СЭС – Казань'),
	(17, NULL, 'csv:ses-rostov', NULL, 'СЭС – Ростов-на-Дону'),
	(18, NULL, 'csv:ses-krasnoyarsk', NULL, 'СЭС – Красноярск');
--> statement-breakpoint
-- Numbers and projects are prod data. Sites that don't exist yet (a fresh
-- database, migrated before bootstrap) simply get no seed.
UPDATE `sites` SET `gudok_project_id` = (
	SELECT `project_id` FROM `__calls_number_seed` s
	WHERE s.`site_id` = `sites`.`id` AND s.`project_id` IS NOT NULL
);
--> statement-breakpoint
INSERT INTO `phone_numbers` (`provider`, `provider_number_id`, `number`, `site_id`, `name`, `created_at`, `updated_at`)
SELECT 'gudok', s.`provider_number_id`, s.`number`, s.`site_id`, s.`name`, CAST(unixepoch('subsec') * 1000 AS INTEGER), CAST(unixepoch('subsec') * 1000 AS INTEGER)
FROM `__calls_number_seed` s
JOIN `sites` ON `sites`.`id` = s.`site_id`;
--> statement-breakpoint
CREATE TABLE `__calls_name_map` (
	`name` text PRIMARY KEY NOT NULL,
	`provider_number_id` text NOT NULL
);
--> statement-breakpoint
-- Every old channel spelling. The `СЭС – …` and `+7 …` spellings of a site with
-- a single known number can only mean that number.
INSERT INTO `__calls_name_map` VALUES
	('Самара', '4635'),
	('Тольятти', '4255'),
	('Новосибирск', '6449'),
	('Воронеж', '6914'),
	('Уфа', '4256'),
	('Челябинск', '6019'),
	('Омск', '6894'),
	('Волгоград', '5264'),
	('Санкт-Петербург', '11193'),
	('Нижний Новгород', '6915'),
	('Екатеринбург', '7077'),
	('Саратов', '12401'),
	('Ярославль', '12402'),
	('Ижевск', '12403'),
	('Казань', '11321'),
	('Томск', '12404'),
	('Ростов-На-Дону', '20395'),
	('Красноярск', '20396'),
	('Ульяновск', 'csv:78422291842'),
	('СЭС – Самара', 'csv:ses-samara'),
	('СЭС – Новосибирск', 'csv:ses-novosibirsk'),
	('СЭС – Челябинск', 'csv:ses-chelyabinsk'),
	('СЭС – Екат', 'csv:ses-ekaterinburg'),
	('СЭС – Казань', 'csv:ses-kazan'),
	('СЭС – Ростов-на-Дону', 'csv:ses-rostov'),
	('СЭС – Красноярск', 'csv:ses-krasnoyarsk'),
	('СЭС – Тольятти', '4255'),
	('СЭС – Воронеж', '6914'),
	('СЭС – Уфа', '4256'),
	('СЭС – Омск', '6894'),
	('СЭС – Волгоград', '5264'),
	('СЭС - Петербург', '11193'),
	('СЭС – Нижний Новгород', '6915'),
	('СЭС – Екатеринбург', '7077'),
	('СЭС – Саратов', '12401'),
	('СЭС – Ярославль', '12402'),
	('СЭС – Ижевск', '12403'),
	('СЭС – Томск', '12404'),
	('+7 863 204 95 53', '20395'),
	('+7 391 275 99 76', '20396'),
	('+7 842 229 18 42', 'csv:78422291842');
--> statement-breakpoint
-- SQLite has no RAISE outside triggers: a failed CHECK aborts the transaction,
-- and the constraint name says which check failed.
CREATE TABLE `__calls_migration_check` (
	`unmapped_names` integer CONSTRAINT `no_unmapped_channel_names` CHECK (`unmapped_names` = 0),
	`row_diff` integer CONSTRAINT `row_count_matches` CHECK (`row_diff` = 0)
);
--> statement-breakpoint
INSERT INTO `__calls_migration_check` (`unmapped_names`)
SELECT count(*) FROM `call_imports_old`
WHERE `adv_channel_name` <> 'Слава – Питер'
	AND `adv_channel_name` NOT IN (SELECT `name` FROM `__calls_name_map`);
--> statement-breakpoint
CREATE TABLE `__calls_shared` (`csv_id` integer PRIMARY KEY NOT NULL);
--> statement-breakpoint
-- A call present in both sources: same key and, after the 3-hour shift, same
-- minute. The webhook row wins.
INSERT INTO `__calls_shared`
SELECT DISTINCT c.`id`
FROM `call_imports_old` c
JOIN `calls_old` w ON w.`site_id` = c.`site_id`
	AND w.`src` = c.`src`
	AND w.`call_number` = c.`call_number`
	AND w.`date` / 60000 = (c.`date` - 10800000) / 60000
WHERE c.`adv_channel_name` <> 'Слава – Питер';
--> statement-breakpoint
INSERT INTO `calls` (`site_id`, `provider`, `provider_number_id`, `provider_call_id`, `src`, `call_number`, `date`, `callstatus`, `billsec`, `region`, `source`, `raw`, `created_at`, `updated_at`)
SELECT
	c.`site_id`, 'gudok', m.`provider_number_id`, NULL, c.`src`, c.`call_number`,
	c.`date` - 10800000, NULL, NULL, NULL, 'csv',
	json_object(
		'id', c.`id`, 'site_id', c.`site_id`, 'date', c.`date`, 'src', c.`src`,
		'region', c.`region`, 'call_number', c.`call_number`, 'class', c.`class`,
		'project_title', c.`project_title`, 'adv_channel_name', c.`adv_channel_name`,
		'billsec', c.`billsec`, 'comment', c.`comment`, 'redirect_number', c.`redirect_number`,
		'source', c.`source`, 'imported_at', c.`imported_at`
	),
	c.`imported_at`, c.`imported_at`
FROM `call_imports_old` c
JOIN `__calls_name_map` m ON m.`name` = c.`adv_channel_name`
WHERE c.`adv_channel_name` <> 'Слава – Питер'
	AND c.`id` NOT IN (SELECT `csv_id` FROM `__calls_shared`)
ORDER BY c.`id`;
--> statement-breakpoint
INSERT INTO `calls` (`site_id`, `provider`, `provider_number_id`, `provider_call_id`, `src`, `call_number`, `date`, `callstatus`, `billsec`, `region`, `source`, `raw`, `created_at`, `updated_at`)
SELECT
	`site_id`, 'gudok', NULLIF(`adv_channel_id`, ''), CAST(`gudok_id` AS TEXT), `src`, `call_number`,
	`date`, `callstatus`, `billsec`, `region`, 'webhook', `raw`, `created_at`, `updated_at`
FROM `calls_old`
ORDER BY `id`;
--> statement-breakpoint
INSERT INTO `__calls_migration_check` (`row_diff`)
SELECT (SELECT count(*) FROM `calls`) - (
	(SELECT count(*) FROM `call_imports_old` WHERE `adv_channel_name` <> 'Слава – Питер')
	- (SELECT count(*) FROM `__calls_shared`)
	+ (SELECT count(*) FROM `calls_old`)
);
--> statement-breakpoint
DROP TABLE `__calls_migration_check`;
--> statement-breakpoint
DROP TABLE `__calls_shared`;
--> statement-breakpoint
DROP TABLE `__calls_name_map`;
--> statement-breakpoint
DROP TABLE `__calls_number_seed`;