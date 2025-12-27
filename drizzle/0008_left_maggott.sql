DROP TABLE `users`;--> statement-breakpoint
DROP TABLE `weddings`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`slug` text NOT NULL,
	`template` text NOT NULL,
	`status` text DEFAULT 'draft',
	`couple_details` text NOT NULL,
	`event_details` text NOT NULL,
	`customizations` text NOT NULL,
	`max_guest_count` integer NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`published_at` integer,
	`expired_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_invitations`("id", "organization_id", "slug", "template", "status", "couple_details", "event_details", "customizations", "max_guest_count", "is_public", "view_count", "published_at", "expired_at", "created_at", "updated_at") SELECT "id", "organization_id", "slug", "template", "status", "couple_details", "event_details", "customizations", "max_guest_count", "is_public", "view_count", "published_at", "expired_at", "created_at", "updated_at" FROM `invitations`;--> statement-breakpoint
DROP TABLE `invitations`;--> statement-breakpoint
ALTER TABLE `__new_invitations` RENAME TO `invitations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_slug_unique` ON `invitations` (`slug`);--> statement-breakpoint
CREATE INDEX `invitations_slug_idx` ON `invitations` (`slug`);--> statement-breakpoint
CREATE INDEX `invitations_organization_id_idx` ON `invitations` (`organization_id`);--> statement-breakpoint
CREATE INDEX `invitations_status_idx` ON `invitations` (`status`);--> statement-breakpoint
CREATE TABLE `__new_documents` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`document_name` text NOT NULL,
	`document_category` text NOT NULL,
	`document_date` text NOT NULL,
	`document_status` text DEFAULT 'pending' NOT NULL,
	`document_due_date` text,
	`file_url` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	`mime_type` text NOT NULL,
	`reminder_sent` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_documents`("id", "organization_id", "document_name", "document_category", "document_date", "document_status", "document_due_date", "file_url", "file_name", "file_size", "mime_type", "reminder_sent", "created_at", "updated_at") SELECT "id", "organization_id", "document_name", "document_category", "document_date", "document_status", "document_due_date", "file_url", "file_name", "file_size", "mime_type", "reminder_sent", "created_at", "updated_at" FROM `documents`;--> statement-breakpoint
DROP TABLE `documents`;--> statement-breakpoint
ALTER TABLE `__new_documents` RENAME TO `documents`;--> statement-breakpoint
CREATE INDEX `documents_organization_id_idx` ON `documents` (`organization_id`);--> statement-breakpoint
CREATE INDEX `documents_type_idx` ON `documents` (`document_category`);--> statement-breakpoint
CREATE TABLE `__new_dowry` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer,
	`status` text DEFAULT 'pending',
	`date_received` integer,
	`recipient` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_dowry`("id", "organization_id", "description", "type", "price", "quantity", "status", "date_received", "recipient", "created_at", "updated_at") SELECT "id", "organization_id", "description", "type", "price", "quantity", "status", "date_received", "recipient", "created_at", "updated_at" FROM `dowry`;--> statement-breakpoint
DROP TABLE `dowry`;--> statement-breakpoint
ALTER TABLE `__new_dowry` RENAME TO `dowry`;--> statement-breakpoint
CREATE INDEX `dowry_organization_id_idx` ON `dowry` (`organization_id`);--> statement-breakpoint
CREATE INDEX `dowry_type_idx` ON `dowry` (`type`);--> statement-breakpoint
CREATE INDEX `dowry_status_idx` ON `dowry` (`status`);--> statement-breakpoint
CREATE TABLE `__new_dresscodes` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`schedule_id` text NOT NULL,
	`description` text NOT NULL,
	`dresscode_role` text NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_dresscodes`("id", "organization_id", "schedule_id", "description", "dresscode_role", "image_url", "created_at", "updated_at") SELECT "id", "organization_id", "schedule_id", "description", "dresscode_role", "image_url", "created_at", "updated_at" FROM `dresscodes`;--> statement-breakpoint
DROP TABLE `dresscodes`;--> statement-breakpoint
ALTER TABLE `__new_dresscodes` RENAME TO `dresscodes`;--> statement-breakpoint
CREATE INDEX `dresscodes_organization_id_idx` ON `dresscodes` (`organization_id`);--> statement-breakpoint
CREATE INDEX `dresscodes_dresscode_role_idx` ON `dresscodes` (`dresscode_role`);--> statement-breakpoint
CREATE INDEX `dresscodes_schedule_id_idx` ON `dresscodes` (`schedule_id`);--> statement-breakpoint
CREATE TABLE `__new_expense_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`category` text,
	`allocated_amount` real DEFAULT 0 NOT NULL,
	`spent_amount` real DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_expense_categories`("id", "organization_id", "category", "allocated_amount", "spent_amount", "created_at", "updated_at") SELECT "id", "organization_id", "category", "allocated_amount", "spent_amount", "created_at", "updated_at" FROM `expense_categories`;--> statement-breakpoint
DROP TABLE `expense_categories`;--> statement-breakpoint
ALTER TABLE `__new_expense_categories` RENAME TO `expense_categories`;--> statement-breakpoint
CREATE INDEX `expense_categories_organization_id_idx` ON `expense_categories` (`organization_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `expense_categories_organization_category_idx` ON `expense_categories` (`organization_id`,`category`);--> statement-breakpoint
CREATE TABLE `__new_expense_items` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`expense_description` text NOT NULL,
	`expense_category` text NOT NULL,
	`expense_amount` real DEFAULT 0 NOT NULL,
	`expense_payment_status` text DEFAULT 'unpaid' NOT NULL,
	`expense_due_date` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_expense_items`("id", "organization_id", "expense_description", "expense_category", "expense_amount", "expense_payment_status", "expense_due_date", "created_at", "updated_at") SELECT "id", "organization_id", "expense_description", "expense_category", "expense_amount", "expense_payment_status", "expense_due_date", "created_at", "updated_at" FROM `expense_items`;--> statement-breakpoint
DROP TABLE `expense_items`;--> statement-breakpoint
ALTER TABLE `__new_expense_items` RENAME TO `expense_items`;--> statement-breakpoint
CREATE INDEX `expense_items_organization_id_idx` ON `expense_items` (`organization_id`);--> statement-breakpoint
CREATE INDEX `expense_items_category_idx` ON `expense_items` (`expense_category`);--> statement-breakpoint
CREATE INDEX `expense_items_amount_idx` ON `expense_items` (`expense_amount`);--> statement-breakpoint
CREATE INDEX `expense_items_payment_status_idx` ON `expense_items` (`expense_payment_status`);--> statement-breakpoint
CREATE INDEX `expense_items_due_date_idx` ON `expense_items` (`expense_due_date`);--> statement-breakpoint
CREATE TABLE `__new_savings_items` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_savings_items`("id", "organization_id", "amount", "description", "date", "created_at") SELECT "id", "organization_id", "amount", "description", "date", "created_at" FROM `savings_items`;--> statement-breakpoint
DROP TABLE `savings_items`;--> statement-breakpoint
ALTER TABLE `__new_savings_items` RENAME TO `savings_items`;--> statement-breakpoint
CREATE INDEX `savings_items_organization_id_idx` ON `savings_items` (`organization_id`);--> statement-breakpoint
CREATE INDEX `savings_items_date_idx` ON `savings_items` (`date`);--> statement-breakpoint
CREATE TABLE `__new_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`schedule_name` text NOT NULL,
	`schedule_category` text NOT NULL,
	`schedule_date` text NOT NULL,
	`schedule_start_time` text NOT NULL,
	`schedule_end_time` text NOT NULL,
	`schedule_location` text NOT NULL,
	`schedule_venue` text NOT NULL,
	`schedule_attendees` text NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_schedules`("id", "organization_id", "schedule_name", "schedule_category", "schedule_date", "schedule_start_time", "schedule_end_time", "schedule_location", "schedule_venue", "schedule_attendees", "is_public", "created_at", "updated_at") SELECT "id", "organization_id", "schedule_name", "schedule_category", "schedule_date", "schedule_start_time", "schedule_end_time", "schedule_location", "schedule_venue", "schedule_attendees", "is_public", "created_at", "updated_at" FROM `schedules`;--> statement-breakpoint
DROP TABLE `schedules`;--> statement-breakpoint
ALTER TABLE `__new_schedules` RENAME TO `schedules`;--> statement-breakpoint
CREATE INDEX `schedules_organization_id_idx` ON `schedules` (`organization_id`);--> statement-breakpoint
CREATE INDEX `schedules_start_time_idx` ON `schedules` (`schedule_start_time`);--> statement-breakpoint
CREATE TABLE `__new_souvenirs` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`vendor_id` text NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`total_cost` real NOT NULL,
	`status` text DEFAULT 'planned',
	`order_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_souvenirs`("id", "organization_id", "vendor_id", "name", "quantity", "unit_price", "total_cost", "status", "order_date", "created_at", "updated_at") SELECT "id", "organization_id", "vendor_id", "name", "quantity", "unit_price", "total_cost", "status", "order_date", "created_at", "updated_at" FROM `souvenirs`;--> statement-breakpoint
DROP TABLE `souvenirs`;--> statement-breakpoint
ALTER TABLE `__new_souvenirs` RENAME TO `souvenirs`;--> statement-breakpoint
CREATE INDEX `souvenirs_organization_id_idx` ON `souvenirs` (`organization_id`);--> statement-breakpoint
CREATE INDEX `souvenirs_vendor_id_idx` ON `souvenirs` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `souvenirs_status_idx` ON `souvenirs` (`status`);--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`task_description` text NOT NULL,
	`task_category` text NOT NULL,
	`task_status` text DEFAULT 'pending' NOT NULL,
	`task_priority` text DEFAULT 'low' NOT NULL,
	`task_due_date` text NOT NULL,
	`completed_at` integer,
	`assigned_to` text,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "organization_id", "task_description", "task_category", "task_status", "task_priority", "task_due_date", "completed_at", "assigned_to", "created_by", "created_at", "updated_at") SELECT "id", "organization_id", "task_description", "task_category", "task_status", "task_priority", "task_due_date", "completed_at", "assigned_to", "created_by", "created_at", "updated_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
CREATE INDEX `tasks_organization_id_idx` ON `tasks` (`organization_id`);--> statement-breakpoint
CREATE INDEX `tasks_status_idx` ON `tasks` (`task_status`);--> statement-breakpoint
CREATE INDEX `tasks_priority_idx` ON `tasks` (`task_priority`);--> statement-breakpoint
CREATE INDEX `tasks_due_date_idx` ON `tasks` (`task_due_date`);--> statement-breakpoint
CREATE INDEX `tasks_created_by_idx` ON `tasks` (`created_by`);--> statement-breakpoint
CREATE INDEX `tasks_assigned_to_idx` ON `tasks` (`assigned_to`);--> statement-breakpoint
CREATE TABLE `__new_vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`organization_id` text NOT NULL,
	`vendor_name` text NOT NULL,
	`vendor_category` text NOT NULL,
	`vendor_instagram` text,
	`vendor_email` text,
	`vendor_phone` text,
	`vendor_website` text,
	`vendor_status` text DEFAULT 'researching' NOT NULL,
	`vendor_rating` text NOT NULL,
	`vendor_total_cost` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_vendors`("id", "organization_id", "vendor_name", "vendor_category", "vendor_instagram", "vendor_email", "vendor_phone", "vendor_website", "vendor_status", "vendor_rating", "vendor_total_cost", "created_at", "updated_at") SELECT "id", "organization_id", "vendor_name", "vendor_category", "vendor_instagram", "vendor_email", "vendor_phone", "vendor_website", "vendor_status", "vendor_rating", "vendor_total_cost", "created_at", "updated_at" FROM `vendors`;--> statement-breakpoint
DROP TABLE `vendors`;--> statement-breakpoint
ALTER TABLE `__new_vendors` RENAME TO `vendors`;--> statement-breakpoint
CREATE INDEX `vendors_organization_id_idx` ON `vendors` (`organization_id`);--> statement-breakpoint
CREATE INDEX `vendors_category_idx` ON `vendors` (`vendor_category`);--> statement-breakpoint
CREATE INDEX `vendors_status_idx` ON `vendors` (`vendor_status`);--> statement-breakpoint
CREATE INDEX `vendors_rating_idx` ON `vendors` (`vendor_rating`);