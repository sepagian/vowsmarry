-- Add composite index for member table to optimize login organization lookup
CREATE INDEX `member_user_id_organization_id_idx` ON `member` (`user_id`,`organization_id`);--> statement-breakpoint