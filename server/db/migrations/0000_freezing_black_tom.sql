CREATE TYPE "public"."card_type" AS ENUM('visa', 'mastercard', 'mir', 'sbp', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('succeeded', 'canceled', 'refunded', 'error');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_id" text NOT NULL,
	"rrn" text,
	"amount" bigint NOT NULL,
	"currency" text DEFAULT 'RUB' NOT NULL,
	"status" "payment_status" NOT NULL,
	"card_mask" text,
	"card_type" "card_type" DEFAULT 'unknown',
	"processed_at" timestamp,
	"raw_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transactions_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"first_name" text,
	"last_name" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE INDEX "payment_id_idx" ON "transactions" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "rrn_idx" ON "transactions" USING btree ("rrn");