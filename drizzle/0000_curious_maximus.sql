CREATE TABLE "budget_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"category_id" uuid,
	"type" varchar(30) NOT NULL,
	"message" text NOT NULL,
	"threshold" numeric(12, 2) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"allocated_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"spent_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"color" varchar(7),
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "budget_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"category_id" uuid,
	"vendor_id" uuid,
	"description" varchar(255) NOT NULL,
	"planned_amount" numeric(12, 2) NOT NULL,
	"actual_amount" numeric(12, 2),
	"due_date" timestamp,
	"status" varchar(20) DEFAULT 'planned' NOT NULL,
	"receipt_url" text,
	"payment_method" varchar(50),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"reminder_date" timestamp NOT NULL,
	"sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"file_url" text,
	"file_name" varchar(255),
	"file_size" integer,
	"mime_type" varchar(100),
	"notes" text,
	"reminder_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dowry_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"value" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"status" varchar(20) DEFAULT 'promised' NOT NULL,
	"giver" varchar(200),
	"receiver" varchar(200),
	"proof_url" text,
	"proof_file_name" varchar(255),
	"witness_name" varchar(200),
	"witness_contact" varchar(255),
	"date_received" timestamp,
	"received_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dresscodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"event_name" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"dresscode_type" varchar(30) NOT NULL,
	"color_scheme" jsonb,
	"guest_instructions" text,
	"inspiration_photos" jsonb,
	"cultural_requirements" text,
	"seasonal_considerations" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"type" varchar(20) NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"file_name" varchar(255),
	"file_size" integer,
	"mime_type" varchar(100),
	"caption" text,
	"alt_text" varchar(255),
	"sort_order" integer NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"uploaded_by" varchar(200),
	"uploaded_by_guest_id" uuid,
	"moderation_status" varchar(20) DEFAULT 'approved' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gift_option_id" uuid NOT NULL,
	"guest_id" uuid,
	"contributor_name" varchar(200) NOT NULL,
	"contributor_email" varchar(255),
	"contributor_phone" varchar(20),
	"amount" numeric(12, 2),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"message" text,
	"payment_method" varchar(50),
	"payment_reference" varchar(100),
	"payment_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"thank_you_sent" boolean DEFAULT false NOT NULL,
	"thank_you_sent_at" timestamp,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"type" varchar(30) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"configuration" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"phone" varchar(20),
	"email" varchar(255),
	"invitation_token" varchar(100),
	"category" varchar(50),
	"max_plus_ones" integer DEFAULT 0 NOT NULL,
	"invitation_sent_at" timestamp,
	"last_viewed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "guests_invitation_token_unique" UNIQUE("invitation_token")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"slug" varchar(100) NOT NULL,
	"template" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"couple_details" jsonb NOT NULL,
	"event_details" jsonb NOT NULL,
	"customizations" jsonb,
	"rsvp_deadline" timestamp,
	"max_guests" integer,
	"is_public" boolean DEFAULT true NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "love_story_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"date" timestamp,
	"media_url" text,
	"media_type" varchar(20),
	"sort_order" integer NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wedding_id" uuid,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"action_url" text,
	"priority" varchar(10) DEFAULT 'medium' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_sent_at" timestamp,
	"expires_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"status" varchar(20) NOT NULL,
	"plus_one_count" integer DEFAULT 0 NOT NULL,
	"plus_one_names" jsonb,
	"meal_preferences" jsonb,
	"dietary_restrictions" text,
	"special_requests" text,
	"guest_message" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rundown_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"event_name" varchar(200) NOT NULL,
	"event_type" varchar(50),
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"duration" integer,
	"location" varchar(300),
	"venue" varchar(300),
	"description" text,
	"status" varchar(20) DEFAULT 'planned' NOT NULL,
	"assigned_to" jsonb,
	"requirements" jsonb,
	"vendor_ids" jsonb,
	"buffer_time" integer,
	"is_public" boolean DEFAULT false NOT NULL,
	"sort_order" integer NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"goal_id" uuid,
	"savings_id" uuid,
	"amount" numeric(12, 2) NOT NULL,
	"type" varchar(20) NOT NULL,
	"description" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"source" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"target_amount" numeric(12, 2) NOT NULL,
	"current_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"target_date" timestamp,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"total_saved" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_target" numeric(12, 2) DEFAULT '0' NOT NULL,
	"goal_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"current_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"monthly_average" numeric(12, 2) DEFAULT '0' NOT NULL,
	"monthly_target" numeric(12, 2) DEFAULT '0' NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "souvenir_distribution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"souvenir_id" uuid NOT NULL,
	"guest_id" uuid,
	"guest_name" varchar(200),
	"quantity" integer DEFAULT 1 NOT NULL,
	"distributed_at" timestamp,
	"distributed_by" varchar(200),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "souvenirs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"vendor_id" uuid,
	"name" varchar(200) NOT NULL,
	"category" varchar(100),
	"description" text,
	"quantity" integer NOT NULL,
	"unit_cost" numeric(10, 2) NOT NULL,
	"total_cost" numeric(12, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'planned' NOT NULL,
	"order_date" timestamp,
	"expected_delivery" timestamp,
	"actual_delivery" timestamp,
	"distribution_plan" text,
	"customization_details" jsonb,
	"quality_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'todo' NOT NULL,
	"priority" varchar(10) DEFAULT 'medium' NOT NULL,
	"due_date" timestamp,
	"assigned_to" varchar(200),
	"assigned_to_name" varchar(200),
	"assigned_to_email" varchar(255),
	"completed_at" timestamp,
	"completed_by" varchar(200),
	"estimated_hours" numeric(5, 2),
	"actual_hours" numeric(5, 2),
	"tags" jsonb,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"category" varchar(100) NOT NULL,
	"contact_info" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'contacted' NOT NULL,
	"contract_url" text,
	"contract_file_name" varchar(255),
	"rating" integer,
	"review" text,
	"total_cost" numeric(12, 2),
	"deposit_paid" numeric(12, 2),
	"final_payment_due" timestamp,
	"notes" text,
	"communication_history" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"partner_name" varchar(200),
	"wedding_date" timestamp,
	"venue" text,
	"budget" numeric(12, 2),
	"status" varchar(20) DEFAULT 'planning' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budget_alerts" ADD CONSTRAINT "budget_alerts_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_alerts" ADD CONSTRAINT "budget_alerts_category_id_budget_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."budget_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_categories" ADD CONSTRAINT "budget_categories_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_category_id_budget_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."budget_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_reminders" ADD CONSTRAINT "document_reminders_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dowry_items" ADD CONSTRAINT "dowry_items_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dresscodes" ADD CONSTRAINT "dresscodes_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_uploaded_by_guest_id_guests_id_fk" FOREIGN KEY ("uploaded_by_guest_id") REFERENCES "public"."guests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_contributions" ADD CONSTRAINT "gift_contributions_gift_option_id_gift_options_id_fk" FOREIGN KEY ("gift_option_id") REFERENCES "public"."gift_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_contributions" ADD CONSTRAINT "gift_contributions_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_options" ADD CONSTRAINT "gift_options_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "love_story_items" ADD CONSTRAINT "love_story_items_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rundown_events" ADD CONSTRAINT "rundown_events_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_goal_id_savings_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."savings_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_savings_id_savings_summaries_id_fk" FOREIGN KEY ("savings_id") REFERENCES "public"."savings_summaries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_goals" ADD CONSTRAINT "savings_goals_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_summaries" ADD CONSTRAINT "savings_summaries_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenir_distribution" ADD CONSTRAINT "souvenir_distribution_souvenir_id_souvenirs_id_fk" FOREIGN KEY ("souvenir_id") REFERENCES "public"."souvenirs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenir_distribution" ADD CONSTRAINT "souvenir_distribution_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "budget_alerts_wedding_id_idx" ON "budget_alerts" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "budget_alerts_type_idx" ON "budget_alerts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "budget_alerts_is_active_idx" ON "budget_alerts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "budget_categories_wedding_id_idx" ON "budget_categories" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "budget_items_wedding_id_idx" ON "budget_items" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "budget_items_category_id_idx" ON "budget_items" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "budget_items_vendor_id_idx" ON "budget_items" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "budget_items_status_idx" ON "budget_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "budget_items_due_date_idx" ON "budget_items" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "document_reminders_document_id_idx" ON "document_reminders" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "document_reminders_reminder_date_idx" ON "document_reminders" USING btree ("reminder_date");--> statement-breakpoint
CREATE INDEX "documents_wedding_id_idx" ON "documents" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "documents_type_idx" ON "documents" USING btree ("type");--> statement-breakpoint
CREATE INDEX "documents_status_idx" ON "documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "documents_due_date_idx" ON "documents" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "dowry_items_wedding_id_idx" ON "dowry_items" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "dowry_items_type_idx" ON "dowry_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "dowry_items_status_idx" ON "dowry_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "dresscodes_wedding_id_idx" ON "dresscodes" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "dresscodes_event_name_idx" ON "dresscodes" USING btree ("event_name");--> statement-breakpoint
CREATE INDEX "dresscodes_type_idx" ON "dresscodes" USING btree ("dresscode_type");--> statement-breakpoint
CREATE INDEX "gallery_items_invitation_id_idx" ON "gallery_items" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "gallery_items_type_idx" ON "gallery_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "gallery_items_sort_order_idx" ON "gallery_items" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "gallery_items_moderation_idx" ON "gallery_items" USING btree ("moderation_status");--> statement-breakpoint
CREATE INDEX "gift_contributions_gift_option_id_idx" ON "gift_contributions" USING btree ("gift_option_id");--> statement-breakpoint
CREATE INDEX "gift_contributions_guest_id_idx" ON "gift_contributions" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "gift_contributions_payment_status_idx" ON "gift_contributions" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "gift_contributions_thank_you_idx" ON "gift_contributions" USING btree ("thank_you_sent");--> statement-breakpoint
CREATE INDEX "gift_options_invitation_id_idx" ON "gift_options" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "gift_options_type_idx" ON "gift_options" USING btree ("type");--> statement-breakpoint
CREATE INDEX "gift_options_is_active_idx" ON "gift_options" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "guests_invitation_id_idx" ON "guests" USING btree ("invitation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "guests_token_idx" ON "guests" USING btree ("invitation_token");--> statement-breakpoint
CREATE INDEX "guests_email_idx" ON "guests" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "invitations_slug_idx" ON "invitations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "invitations_wedding_id_idx" ON "invitations" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "invitations_status_idx" ON "invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "love_story_items_invitation_id_idx" ON "love_story_items" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "love_story_items_sort_order_idx" ON "love_story_items" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "love_story_items_date_idx" ON "love_story_items" USING btree ("date");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_wedding_id_idx" ON "notifications" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notifications_priority_idx" ON "notifications" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "notifications_is_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "rsvps_guest_id_idx" ON "rsvps" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "rsvps_status_idx" ON "rsvps" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rundown_events_wedding_id_idx" ON "rundown_events" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "rundown_events_start_time_idx" ON "rundown_events" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "rundown_events_sort_order_idx" ON "rundown_events" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "rundown_events_status_idx" ON "rundown_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "savings_entries_wedding_id_idx" ON "savings_entries" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "savings_entries_goal_id_idx" ON "savings_entries" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "savings_entries_savings_id_idx" ON "savings_entries" USING btree ("savings_id");--> statement-breakpoint
CREATE INDEX "savings_entries_type_idx" ON "savings_entries" USING btree ("type");--> statement-breakpoint
CREATE INDEX "savings_entries_date_idx" ON "savings_entries" USING btree ("date");--> statement-breakpoint
CREATE INDEX "savings_goals_wedding_id_idx" ON "savings_goals" USING btree ("wedding_id");--> statement-breakpoint
CREATE UNIQUE INDEX "savings_summaries_wedding_id_idx" ON "savings_summaries" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "souvenir_distribution_souvenir_id_idx" ON "souvenir_distribution" USING btree ("souvenir_id");--> statement-breakpoint
CREATE INDEX "souvenir_distribution_guest_id_idx" ON "souvenir_distribution" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "souvenirs_wedding_id_idx" ON "souvenirs" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "souvenirs_vendor_id_idx" ON "souvenirs" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "souvenirs_status_idx" ON "souvenirs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "souvenirs_category_idx" ON "souvenirs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "todos_wedding_id_idx" ON "todos" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "todos_status_idx" ON "todos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "todos_priority_idx" ON "todos" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "todos_due_date_idx" ON "todos" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "todos_assigned_to_idx" ON "todos" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "vendors_wedding_id_idx" ON "vendors" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "vendors_category_idx" ON "vendors" USING btree ("category");--> statement-breakpoint
CREATE INDEX "vendors_status_idx" ON "vendors" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vendors_rating_idx" ON "vendors" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "weddings_user_id_idx" ON "weddings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "weddings_status_idx" ON "weddings" USING btree ("status");