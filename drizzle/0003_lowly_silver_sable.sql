ALTER TABLE "guestBook" DROP CONSTRAINT "guestBook_username_unique";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "guestBook" DROP COLUMN IF EXISTS "username";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");