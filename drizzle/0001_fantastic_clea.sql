ALTER TABLE "schedules" RENAME COLUMN "rundown_name" TO "schedule_name";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "rundown_type" TO "schedule_category";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "start_time" TO "schedule_start_time";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "end_time" TO "schedule_end_time";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "location" TO "schedule_location";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "venue" TO "schedule_venue";--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "attendees" TO "schedule_attendees";--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "schedule_category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."rundown_type";--> statement-breakpoint
CREATE TYPE "public"."rundown_type" AS ENUM('preparation', 'ceremony', 'reception', 'entertainment', 'logistics', 'photo-video', 'paperwork', 'closing', 'miscellaneous');--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "schedule_category" SET DATA TYPE "public"."rundown_type" USING "schedule_category"::"public"."rundown_type";--> statement-breakpoint
DROP INDEX "rundown_events_start_time_idx";--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "schedule_date" date NOT NULL;--> statement-breakpoint
CREATE INDEX "rundown_events_start_time_idx" ON "schedules" USING btree ("schedule_start_time");--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "notes";