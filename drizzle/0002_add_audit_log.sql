CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`user_id` text NOT NULL,
	`action_type` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text,
	`description` text NOT NULL,
	`changes` text,
	`ip_address` text,
	`user_agent` text,
	`status` text NOT NULL DEFAULT 'success',
	`error_message` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_log_organizationId_idx` ON `audit_log` (`organization_id`);
--> statement-breakpoint
CREATE INDEX `audit_log_userId_idx` ON `audit_log` (`user_id`);
--> statement-breakpoint
CREATE INDEX `audit_log_actionType_idx` ON `audit_log` (`action_type`);
--> statement-breakpoint
CREATE INDEX `audit_log_resourceType_idx` ON `audit_log` (`resource_type`);
--> statement-breakpoint
CREATE INDEX `audit_log_resourceId_idx` ON `audit_log` (`resource_id`);
--> statement-breakpoint
CREATE INDEX `audit_log_createdAt_idx` ON `audit_log` (`created_at`);
--> statement-breakpoint
CREATE INDEX `audit_log_org_created_idx` ON `audit_log` (`organization_id`, `created_at`);
