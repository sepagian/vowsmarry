CREATE TYPE "public"."vendor_rating" AS ENUM('1', '2', '3', '4', '5');--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "document_category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."document_category";--> statement-breakpoint
CREATE TYPE "public"."document_category" AS ENUM('legal_formal', 'vendor_finance', 'guest_ceremony', 'personal_keepsake', 'miscellaneous', 'other');--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "document_category" SET DATA TYPE "public"."document_category" USING "document_category"::"public"."document_category";--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "document_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "file_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "rating" SET DATA TYPE "public"."vendor_rating" USING "rating"::"public"."vendor_rating";--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "rating" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weddings" ALTER COLUMN "budget" SET DATA TYPE numeric(12);