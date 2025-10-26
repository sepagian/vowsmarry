CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved');--> statement-breakpoint
ALTER TABLE "gallery" RENAME COLUMN "wedding_id" TO "invitation_id";--> statement-breakpoint
ALTER TABLE "guests" RENAME COLUMN "wedding_id" TO "invitation_id";--> statement-breakpoint
ALTER TABLE "gallery" DROP CONSTRAINT "gallery_wedding_id_invitations_id_fk";
--> statement-breakpoint
ALTER TABLE "guests" DROP CONSTRAINT "guests_wedding_id_invitations_id_fk";
--> statement-breakpoint
DROP INDEX "gallery_invitation_id_idx";--> statement-breakpoint
DROP INDEX "guests_invitation_id_idx";--> statement-breakpoint
ALTER TABLE "gallery" ADD COLUMN "moderation_status" "moderation_status" DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "gallery_invitation_id_idx" ON "gallery" USING btree ("invitation_id");--> statement-breakpoint
CREATE INDEX "guests_invitation_id_idx" ON "guests" USING btree ("invitation_id");