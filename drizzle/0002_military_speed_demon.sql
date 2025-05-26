CREATE TABLE "redeem" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text NOT NULL,
	"stock" integer NOT NULL,
	"price" integer NOT NULL,
	"preview_img" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "useritems" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"redeem_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "useritems" ADD CONSTRAINT "useritems_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "useritems" ADD CONSTRAINT "useritems_redeem_id_redeem_id_fk" FOREIGN KEY ("redeem_id") REFERENCES "public"."redeem"("id") ON DELETE no action ON UPDATE no action;