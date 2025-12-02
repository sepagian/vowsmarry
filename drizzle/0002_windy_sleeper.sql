CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`inviter_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`role` text DEFAULT 'member',
	`status` text DEFAULT 'pending',
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitation_email_unique` ON `invitation` (`email`);--> statement-breakpoint
CREATE TABLE `member` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`organization_id` text NOT NULL,
	`role` text DEFAULT 'member',
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`logo` text,
	`metadata` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organization_slug_unique` ON `organization` (`slug`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`active_organization_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`active_organization_id`) REFERENCES `organization`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation_id` text NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`file_name` text NOT NULL,
	`filesize` integer NOT NULL,
	`mime_type` text NOT NULL,
	`caption` text,
	`sort_order` integer NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`uploaded_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gallery_invitation_id_idx` ON `gallery` (`invitation_id`);--> statement-breakpoint
CREATE INDEX `gallery_type_idx` ON `gallery` (`type`);--> statement-breakpoint
CREATE INDEX `gallery_sort_order_idx` ON `gallery` (`sort_order`);--> statement-breakpoint
CREATE TABLE `gifts` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`bank_account` text,
	`bank_number` real,
	`registry_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `gifts_invitation_id_idx` ON `gifts` (`invitation_id`);--> statement-breakpoint
CREATE INDEX `gifts_type_idx` ON `gifts` (`type`);--> statement-breakpoint
CREATE INDEX `gifts_is_active_idx` ON `gifts` (`is_active`);--> statement-breakpoint
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation_id` text NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`email` text,
	`invitation_token` text,
	`category` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `guests_invitation_token_unique` ON `guests` (`invitation_token`);--> statement-breakpoint
CREATE INDEX `guests_invitation_id_idx` ON `guests` (`invitation_id`);--> statement-breakpoint
CREATE INDEX `guests_invitation_token_idx` ON `guests` (`invitation_token`);--> statement-breakpoint
CREATE INDEX `guests_phone_idx` ON `guests` (`phone`);--> statement-breakpoint
CREATE INDEX `guests_email_idx` ON `guests` (`email`);--> statement-breakpoint
CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
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
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_slug_unique` ON `invitations` (`slug`);--> statement-breakpoint
CREATE INDEX `invitations_slug_idx` ON `invitations` (`slug`);--> statement-breakpoint
CREATE INDEX `invitations_wedding_id_idx` ON `invitations` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `invitations_status_idx` ON `invitations` (`status`);--> statement-breakpoint
CREATE TABLE `love_story` (
	`id` text PRIMARY KEY NOT NULL,
	`invitation_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`date` text,
	`media_url` text,
	`media_type` text,
	`sort_order` integer NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `love_story_invitation_id_idx` ON `love_story` (`invitation_id`);--> statement-breakpoint
CREATE INDEX `love_story_sort_order_idx` ON `love_story` (`sort_order`);--> statement-breakpoint
CREATE INDEX `love_story_date_idx` ON `love_story` (`date`);--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`status` text NOT NULL,
	`plus_one_count` integer DEFAULT 0 NOT NULL,
	`plus_one_names` text,
	`guest_message` text,
	`submitted_at` integer NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `rsvps_guest_id_idx` ON `rsvps` (`guest_id`);--> statement-breakpoint
CREATE INDEX `rsvps_status_idx` ON `rsvps` (`status`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
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
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `documents_wedding_id_idx` ON `documents` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `documents_type_idx` ON `documents` (`document_category`);--> statement-breakpoint
CREATE TABLE `dowry` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer,
	`status` text DEFAULT 'pending',
	`date_received` integer,
	`recipient` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `dowry_wedding_id_idx` ON `dowry` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `dowry_type_idx` ON `dowry` (`type`);--> statement-breakpoint
CREATE INDEX `dowry_status_idx` ON `dowry` (`status`);--> statement-breakpoint
CREATE TABLE `dresscodes` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`schedule_id` text NOT NULL,
	`description` text NOT NULL,
	`dresscode_role` text NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `dresscodes_wedding_id_idx` ON `dresscodes` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `dresscodes_dresscode_role_idx` ON `dresscodes` (`dresscode_role`);--> statement-breakpoint
CREATE INDEX `dresscodes_rundown_id_idx` ON `dresscodes` (`schedule_id`);--> statement-breakpoint
CREATE TABLE `expense_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`category` text,
	`allocated_amount` real DEFAULT 0 NOT NULL,
	`spent_amount` real DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `expense_categories_wedding_id_idx` ON `expense_categories` (`wedding_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `expense_categories_wedding_category_idx` ON `expense_categories` (`wedding_id`,`category`);--> statement-breakpoint
CREATE TABLE `expense_items` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`expense_description` text NOT NULL,
	`expense_category` text NOT NULL,
	`expense_amount` real DEFAULT 0 NOT NULL,
	`expense_payment_status` text DEFAULT 'unpaid' NOT NULL,
	`expense_due_date` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `expense_items_wedding_id_idx` ON `expense_items` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `expense_items_category_idx` ON `expense_items` (`expense_category`);--> statement-breakpoint
CREATE INDEX `expense_items_amount_idx` ON `expense_items` (`expense_amount`);--> statement-breakpoint
CREATE INDEX `expense_items_payment_status_idx` ON `expense_items` (`expense_payment_status`);--> statement-breakpoint
CREATE INDEX `expense_items_due_date_idx` ON `expense_items` (`expense_due_date`);--> statement-breakpoint
CREATE TABLE `savings_items` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`amount` real NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `savings_items_wedding_id_idx` ON `savings_items` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `savings_items_date_idx` ON `savings_items` (`date`);--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
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
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `rundown_events_wedding_id_idx` ON `schedules` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `rundown_events_start_time_idx` ON `schedules` (`schedule_start_time`);--> statement-breakpoint
CREATE TABLE `souvenirs` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`vendor_id` text NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`total_cost` real NOT NULL,
	`status` text DEFAULT 'planned',
	`order_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vendor_id`) REFERENCES `vendors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `souvenirs_wedding_id_idx` ON `souvenirs` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `souvenirs_vendor_id_idx` ON `souvenirs` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `souvenirs_status_idx` ON `souvenirs` (`status`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
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
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tasks_wedding_id_idx` ON `tasks` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `tasks_status_idx` ON `tasks` (`task_status`);--> statement-breakpoint
CREATE INDEX `tasks_priority_idx` ON `tasks` (`task_priority`);--> statement-breakpoint
CREATE INDEX `tasks_due_date_idx` ON `tasks` (`task_due_date`);--> statement-breakpoint
CREATE INDEX `tasks_created_by_idx` ON `tasks` (`created_by`);--> statement-breakpoint
CREATE INDEX `tasks_assigned_to_idx` ON `tasks` (`assigned_to`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
	`user_name` text,
	`user_email` text,
	`user_phone` text,
	`user_role` text DEFAULT 'partner',
	`avatar_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `users_wedding_id_idx` ON `users` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`user_email`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`user_role`);--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`wedding_id` text NOT NULL,
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
	FOREIGN KEY (`wedding_id`) REFERENCES `weddings`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `vendors_wedding_id_idx` ON `vendors` (`wedding_id`);--> statement-breakpoint
CREATE INDEX `vendors_category_idx` ON `vendors` (`vendor_category`);--> statement-breakpoint
CREATE INDEX `vendors_status_idx` ON `vendors` (`vendor_status`);--> statement-breakpoint
CREATE INDEX `vendors_rating_idx` ON `vendors` (`vendor_rating`);--> statement-breakpoint
CREATE TABLE `weddings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`groom_name` text,
	`bride_name` text,
	`wedding_date` text,
	`wedding_venue` text,
	`wedding_budget` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `weddings_user_id_idx` ON `weddings` (`user_id`);