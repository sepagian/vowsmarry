CREATE TYPE "public"."budget_status" AS ENUM('planned', 'paid', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('permit', 'license', 'contract', 'other');--> statement-breakpoint
CREATE TYPE "public"."dowry_status" AS ENUM('promised', 'received', 'documented', 'verified');--> statement-breakpoint
CREATE TYPE "public"."dowry_type" AS ENUM('cash', 'gold', 'property', 'jewelry', 'vehicle', 'electronics', 'furniture', 'other');--> statement-breakpoint
CREATE TYPE "public"."dresscode_type" AS ENUM('formal', 'semi_formal', 'casual', 'traditional', 'custom');--> statement-breakpoint
CREATE TYPE "public"."gift_option_type" AS ENUM('digital_envelope', 'registry', 'cash');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('draft', 'published', 'expired');--> statement-breakpoint
CREATE TYPE "public"."rsvp_status" AS ENUM('attending', 'declined');--> statement-breakpoint
CREATE TYPE "public"."rundown_event_status" AS ENUM('planned', 'confirmed', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."rundown_event_type" AS ENUM('ceremony', 'reception', 'preparation', 'photography', 'transportation', 'other');--> statement-breakpoint
CREATE TYPE "public"."savings_entry_type" AS ENUM('deposit', 'withdrawal', 'interest', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."souvenir_category" AS ENUM('edible', 'decorative', 'practical', 'religious', 'custom');--> statement-breakpoint
CREATE TYPE "public"."souvenir_status" AS ENUM('planned', 'ordered', 'received', 'distributed');--> statement-breakpoint
CREATE TYPE "public"."todo_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."todo_status" AS ENUM('todo', 'in_progress', 'done');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('contacted', 'negotiating', 'booked', 'completed');--> statement-breakpoint
CREATE TYPE "public"."wedding_status" AS ENUM('planning', 'active', 'completed');--> statement-breakpoint
CREATE TABLE "budget_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"planned_amount" numeric(10, 2) NOT NULL,
	"actual_amount" numeric(10, 2),
	"vendor_id" uuid,
	"due_date" date,
	"status" "budget_status" DEFAULT 'planned',
	"receipt_url" text,
	"payment_method" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"title" text NOT NULL,
	"type" "document_type" NOT NULL,
	"status" "document_status" DEFAULT 'pending',
	"due_date" date,
	"file_url" text,
	"file_name" text,
	"file_size" integer,
	"mime_type" text,
	"notes" text,
	"reminder_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dowry_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"type" "dowry_type" NOT NULL,
	"sub_type" text,
	"description" text NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"status" "dowry_status" DEFAULT 'promised',
	"proof_url" jsonb,
	"certificate_url" text,
	"appraisal_url" text,
	"giver" text NOT NULL,
	"giver_relation" text,
	"receiver" text NOT NULL,
	"receiver_relation" text,
	"witness_names" jsonb,
	"religious_requirement" boolean DEFAULT false,
	"legal_requirement" boolean DEFAULT false,
	"customary_requirement" boolean DEFAULT false,
	"location" text,
	"received_date" date,
	"documented_date" date,
	"notes" text,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dresscodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"description" text NOT NULL,
	"color_scheme" jsonb,
	"dresscode_type" "dresscode_type" NOT NULL,
	"inspiration_images" jsonb DEFAULT '[]'::jsonb,
	"guest_instructions" text,
	"male_attire" jsonb,
	"female_attire" jsonb,
	"children_attire" jsonb,
	"weather_considerations" text,
	"cultural_requirements" text,
	"accessory_guidelines" text,
	"is_public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"media_url" text NOT NULL,
	"media_type" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gift_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gift_option_id" uuid NOT NULL,
	"guest_id" uuid,
	"contributor_name" text NOT NULL,
	"amount" numeric(10, 2),
	"message" text,
	"payment_status" text DEFAULT 'pending',
	"payment_reference" text,
	"thank_you_sent" boolean DEFAULT false,
	"contributed_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gift_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"type" "gift_option_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"bank_info" jsonb,
	"registry_info" jsonb,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"invitation_token" text NOT NULL,
	"invited_at" timestamp,
	"viewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "guests_invitation_token_unique" UNIQUE("invitation_token")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"template" text NOT NULL,
	"couple_details" jsonb NOT NULL,
	"event_details" jsonb NOT NULL,
	"status" "invitation_status" DEFAULT 'draft',
	"published_at" timestamp,
	"expires_at" timestamp,
	"view_count" integer DEFAULT 0,
	"rsvp_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "invitations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "love_story_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"date" date,
	"media_url" text,
	"media_type" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_id" uuid NOT NULL,
	"status" "rsvp_status" NOT NULL,
	"plus_one_count" integer DEFAULT 0,
	"meal_preferences" jsonb,
	"special_requests" text,
	"submitted_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rundown_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"event_type" "rundown_event_type" NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"duration" integer,
	"location" text,
	"venue" text,
	"description" text,
	"assigned_to" jsonb,
	"assigned_roles" jsonb,
	"requirements" jsonb,
	"equipment" jsonb,
	"vendors" jsonb,
	"guest_count" integer,
	"dresscode" text,
	"music_playlist" text,
	"special_instructions" text,
	"backup_plan" text,
	"status" "rundown_event_status" DEFAULT 'planned',
	"priority" "todo_priority" DEFAULT 'medium',
	"dependencies" jsonb,
	"buffer_time" integer,
	"notes" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "savings_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"savings_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"type" "savings_entry_type" NOT NULL,
	"source" text,
	"description" text,
	"date" date NOT NULL,
	"receipt_url" text,
	"bank_transaction_id" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "savings_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"goal_amount" numeric(12, 2) NOT NULL,
	"current_amount" numeric(12, 2) DEFAULT '0',
	"target_date" date,
	"monthly_target" numeric(10, 2),
	"auto_save_amount" numeric(10, 2),
	"auto_save_frequency" text,
	"bank_account_id" text,
	"interest_rate" numeric(5, 4),
	"projected_completion" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "souvenirs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "souvenir_category" NOT NULL,
	"vendor_id" uuid,
	"vendor_name" text,
	"quantity" integer NOT NULL,
	"unit_cost" numeric(8, 2) NOT NULL,
	"total_cost" numeric(10, 2) NOT NULL,
	"status" "souvenir_status" DEFAULT 'planned',
	"order_date" date,
	"expected_delivery" date,
	"actual_delivery" date,
	"distribution_plan" text,
	"distribution_date" date,
	"packaging" jsonb,
	"customization" jsonb,
	"quality_check" boolean DEFAULT false,
	"quality_notes" text,
	"storage_location" text,
	"expiry_date" date,
	"tags" jsonb,
	"image_url" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "todo_status" DEFAULT 'todo',
	"priority" "todo_priority" DEFAULT 'medium',
	"due_date" date,
	"assigned_to" text,
	"assigned_to_name" text,
	"completed_at" timestamp,
	"completed_by" text,
	"estimated_hours" integer,
	"actual_hours" integer,
	"tags" jsonb,
	"dependencies" jsonb,
	"attachments" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" text,
	"password_reset_token" text,
	"password_reset_expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wedding_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"contact_info" jsonb,
	"status" "vendor_status" DEFAULT 'contacted',
	"contract_url" text,
	"rating" integer,
	"review" text,
	"total_cost" numeric(10, 2),
	"deposit_paid" numeric(10, 2),
	"final_payment_due" date,
	"services" jsonb,
	"notes" text,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"partner_name" text,
	"wedding_date" date,
	"venue" text,
	"budget" numeric(12, 2),
	"status" "wedding_status" DEFAULT 'planning',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "budget_items" ADD CONSTRAINT "budget_items_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dowry_items" ADD CONSTRAINT "dowry_items_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dresscodes" ADD CONSTRAINT "dresscodes_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_items" ADD CONSTRAINT "gallery_items_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_contributions" ADD CONSTRAINT "gift_contributions_gift_option_id_gift_options_id_fk" FOREIGN KEY ("gift_option_id") REFERENCES "public"."gift_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_contributions" ADD CONSTRAINT "gift_contributions_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_options" ADD CONSTRAINT "gift_options_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "love_story_items" ADD CONSTRAINT "love_story_items_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rundown_events" ADD CONSTRAINT "rundown_events_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_entries" ADD CONSTRAINT "savings_entries_savings_id_savings_summaries_id_fk" FOREIGN KEY ("savings_id") REFERENCES "public"."savings_summaries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_summaries" ADD CONSTRAINT "savings_summaries_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "souvenirs" ADD CONSTRAINT "souvenirs_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_wedding_id_weddings_id_fk" FOREIGN KEY ("wedding_id") REFERENCES "public"."weddings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weddings" ADD CONSTRAINT "weddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;