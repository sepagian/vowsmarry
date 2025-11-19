CREATE TYPE "public"."category" AS ENUM('accommodation', 'catering', 'decoration', 'entertainment', 'makeup-attire', 'paperwork', 'photo-video', 'venue', 'miscellaneous', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_category" AS ENUM('legal_formal', 'vendor_finance', 'guest-ceremony', 'personal-keepsake', 'miscellaneous', 'other');--> statement-breakpoint
CREATE TYPE "public"."dowry_recipient" AS ENUM('groom', 'bride');--> statement-breakpoint
CREATE TYPE "public"."dowry_status" AS ENUM('pending', 'delivered', 'received');--> statement-breakpoint
CREATE TYPE "public"."dowry_type" AS ENUM('cash', 'gold', 'jewelry', 'fashion', 'beauty', 'furniture', 'property', 'other');--> statement-breakpoint
CREATE TYPE "public"."dresscode_role" AS ENUM('groom', 'bride', 'groom_family', 'bride_family', 'groomsmen', 'bridesmaids', 'other');--> statement-breakpoint
CREATE TYPE "public"."expense_payment_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
CREATE TYPE "public"."gallery_type" AS ENUM('photo', 'video');--> statement-breakpoint
CREATE TYPE "public"."gift_type" AS ENUM('digital wallet', 'registry');--> statement-breakpoint
CREATE TYPE "public"."guest_category" AS ENUM('family', 'friend', 'colleague');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('attending', 'declined');--> statement-breakpoint
CREATE TYPE "public"."rundown_type" AS ENUM('preparation', 'ceremony', 'reception', 'entertainment', 'logistics', 'photo-video', 'paperwork', 'closing', 'miscellaneous', 'other');--> statement-breakpoint
CREATE TYPE "public"."souvenir_status" AS ENUM('planned', 'ordered', 'delivered', 'received');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'on_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('researching', 'contacted', 'quoted', 'booked');--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"type" "gallery_type" NOT NULL,
	"url" varchar(255) NOT NULL,
	"description" text,
	"file_name" varchar(255) NOT NULL,
	"filesize" integer NOT NULL,
	"mime_type" varchar(255) NOT NULL,
	"caption" varchar(255),
	"sort_order" integer NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"type" "gift_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"bank_account" varchar(30),
	"bank_number" numeric,
	"registry_url" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"sort_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(50),
	"email" varchar(255),
	"invitation_token" varchar(255),
	"category" "guest_category",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "guests_invitation_token_unique" UNIQUE("invitation_token")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"template" varchar(255) NOT NULL,
	"status" "invitation_status" DEFAULT 'draft',
	"couple_details" jsonb NOT NULL,
	"event_details" jsonb NOT NULL,
	"customizations" jsonb NOT NULL,
	"max_guest_count" integer NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp,
	"expired_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "love_story" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"date" date,
	"media_url" text,
	"media_type" varchar(20),
	"sort_order" integer NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"status" "rsvp_status" NOT NULL,
	"plus_one_count" integer DEFAULT 0 NOT NULL,
	"plus_one_names" jsonb,
	"guest_message" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"document_category" "document_category" NOT NULL,
	"document_date" date,
	"file_url" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dowry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"description" varchar(255),
	"type" "dowry_type" NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"quantity" integer,
	"status" "dowry_status" DEFAULT 'pending',
	"date_received" timestamp,
	"recipient" "dowry_recipient" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dresscodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"rundown_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"dresscode_role" "dresscode_role" NOT NULL,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"category" "category",
	"allocated_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"spent_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"category_id" uuid,
	"amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"vendor_id" uuid,
	"payment_status" "expense_payment_status" DEFAULT 'unpaid',
	"due_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rundowns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"rundown_name" varchar(200) NOT NULL,
	"rundown_type" "rundown_type",
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"location" varchar(255),
	"venue" varchar(255),
	"attendees" varchar(255),
	"assigned_to" jsonb,
	"vendor_ids" jsonb,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"savings_id" uuid,
	"amount" numeric(12, 2) NOT NULL,
	"description" varchar(255),
	"date" date DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savings_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"total_saved" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total_target" numeric(12, 2) DEFAULT '0' NOT NULL,
	"monthly_average" numeric(12, 2) DEFAULT '0' NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "souvenirs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(12, 2) NOT NULL,
	"total_cost" numeric(12, 2) NOT NULL,
	"status" "souvenir_status" DEFAULT 'planned',
	"order_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"description" varchar(255) NOT NULL,
	"category" "category" NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"priority" "task_priority" DEFAULT 'low' NOT NULL,
	"due_date" date NOT NULL,
	"completed_at" timestamp,
	"assigned_to" uuid,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"category" "category",
	"instagram" varchar(50),
	"email" varchar(255),
	"phone" varchar(50),
	"website" varchar(50),
	"status" "vendor_status" DEFAULT 'researching',
	"rating" integer,
	"total_cost" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"partner_name" varchar(200),
	"wedding_date" date,
	"venue" varchar,
	"budget" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gifts" ADD CONSTRAINT "gifts_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "love_story" ADD CONSTRAINT "love_story_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dowry" ADD CONSTRAINT "dowry_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dresscodes" ADD CONSTRAINT "dresscodes_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dresscodes" ADD CONSTRAINT "dresscodes_rundown_id_rundowns_id_fk" FOREIGN KEY ("rundown_id") REFERENCES "public"."rundowns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_categories" ADD CONSTRAINT "expense_categories_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_category_id_expense_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rundowns" ADD CONSTRAINT "rundowns_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_items" ADD CONSTRAINT "savings_items_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_items" ADD CONSTRAINT "savings_items_savings_id_savings_summary_id_fk" FOREIGN KEY ("savings_id") REFERENCES "public"."savings_summary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_summary" ADD CONSTRAINT "savings_summary_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_invitation_id_idx" ON "gallery" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "gallery_type_idx" ON "gallery" USING btree ("type");--> statement-breakpoint
CREATE INDEX "gallery_sort_order_idx" ON "gallery" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "gifts_invitation_id_idx" ON "gifts" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "gifts_type_idx" ON "gifts" USING btree ("type");--> statement-breakpoint
CREATE INDEX "gifts_is_active_idx" ON "gifts" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "guests_invitation_id_idx" ON "guests" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "guests_invitation_token_idx" ON "guests" USING btree ("invitation_token");--> statement-breakpoint
CREATE INDEX "guests_phone_idx" ON "guests" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "guests_email_idx" ON "guests" USING btree ("email");--> statement-breakpoint
CREATE INDEX "invitations_slug_idx" ON "invitations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "invitations_wedding_id_idx" ON "invitations" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "invitations_status_idx" ON "invitations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "love_story_invitation_id_idx" ON "love_story" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "love_story_sort_order_idx" ON "love_story" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "love_story_date_idx" ON "love_story" USING btree ("date");--> statement-breakpoint
CREATE INDEX "rsvps_guest_id_idx" ON "rsvps" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "rsvps_status_idx" ON "rsvps" USING btree ("status");--> statement-breakpoint
CREATE INDEX "documents_wedding_id_idx" ON "documents" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "documents_type_idx" ON "documents" USING btree ("document_category");--> statement-breakpoint
CREATE INDEX "dowry_wedding_id_idx" ON "dowry" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "dowry_type_idx" ON "dowry" USING btree ("type");--> statement-breakpoint
CREATE INDEX "dowry_status_idx" ON "dowry" USING btree ("status");--> statement-breakpoint
CREATE INDEX "dresscodes_wedding_id_idx" ON "dresscodes" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "dresscodes_dresscode_role_idx" ON "dresscodes" USING btree ("dresscode_role");--> statement-breakpoint
CREATE INDEX "dresscodes_rundown_id_idx" ON "dresscodes" USING btree ("rundown_id");--> statement-breakpoint
CREATE INDEX "expense_categories_wedding_id_idx" ON "expense_categories" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "expense_items_wedding_id_idx" ON "expense_items" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "expense_items_category_id_idx" ON "expense_items" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "expense_items_amount_idx" ON "expense_items" USING btree ("amount");--> statement-breakpoint
CREATE INDEX "expense_items_vendor_id_idx" ON "expense_items" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "expense_items_payment_status_idx" ON "expense_items" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "expense_items_due_date_idx" ON "expense_items" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "rundown_events_wedding_id_idx" ON "rundowns" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "rundown_events_start_time_idx" ON "rundowns" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "savings_items_wedding_id_idx" ON "savings_items" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "savings_items_savings_id_idx" ON "savings_items" USING btree ("savings_id");--> statement-breakpoint
CREATE INDEX "savings_items_date_idx" ON "savings_items" USING btree ("date");--> statement-breakpoint
CREATE UNIQUE INDEX "savings_summaries_wedding_id_idx" ON "savings_summary" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "souvenirs_wedding_id_idx" ON "souvenirs" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "souvenirs_vendor_id_idx" ON "souvenirs" USING btree ("vendor_id");--> statement-breakpoint
CREATE INDEX "souvenirs_status_idx" ON "souvenirs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tasks_wedding_id_idx" ON "tasks" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "tasks_status_idx" ON "tasks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tasks_priority_idx" ON "tasks" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "tasks_due_date_idx" ON "tasks" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "tasks_created_by_idx" ON "tasks" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "tasks_assigned_to_idx" ON "tasks" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "vendors_wedding_id_idx" ON "vendors" USING btree ("wedding_id");--> statement-breakpoint
CREATE INDEX "vendors_category_idx" ON "vendors" USING btree ("category");--> statement-breakpoint
CREATE INDEX "vendors_status_idx" ON "vendors" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vendors_rating_idx" ON "vendors" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "weddings_user_id_idx" ON "weddings" USING btree ("user_id");