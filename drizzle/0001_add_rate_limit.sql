CREATE TABLE `rate_limit` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL UNIQUE,
	`count` integer NOT NULL DEFAULT 0,
	`reset_time` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limit_key_idx` ON `rate_limit` (`key`);
--> statement-breakpoint
CREATE INDEX `rate_limit_resetTime_idx` ON `rate_limit` (`reset_time`);
