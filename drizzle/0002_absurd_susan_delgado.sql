ALTER TABLE "guestBook" ADD COLUMN "username" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "guestBook" ADD CONSTRAINT "guestBook_username_unique" UNIQUE("username");