DROP INDEX `invitations_slug_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_org_slug_unique` ON `invitations` (`organization_id`,`slug`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo` text,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`groom_name` text,
	`bride_name` text,
	`wedding_date` text,
	`wedding_venue` text,
	`wedding_budget` integer
);
--> statement-breakpoint
INSERT INTO `__new_organization`("id", "name", "slug", "logo", "metadata", "created_at", "groom_name", "bride_name", "wedding_date", "wedding_venue", "wedding_budget") SELECT "id", "name", "slug", "logo", "metadata", "created_at", "groom_name", "bride_name", "wedding_date", "wedding_venue", "wedding_budget" FROM `organization`;--> statement-breakpoint
DROP TABLE `organization`;--> statement-breakpoint
ALTER TABLE `__new_organization` RENAME TO `organization`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);