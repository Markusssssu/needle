DROP INDEX "payment_id_idx";--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "rrn" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "currency" SET DATA TYPE char(3);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "currency" SET DEFAULT 'RUB';--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;