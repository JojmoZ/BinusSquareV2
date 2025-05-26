CREATE TABLE "electric" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "electric_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"electric_id" integer NOT NULL,
	"watt" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "electric" ADD CONSTRAINT "electric_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "electric_detail" ADD CONSTRAINT "electric_detail_electric_id_electric_id_fk" FOREIGN KEY ("electric_id") REFERENCES "public"."electric"("id") ON DELETE no action ON UPDATE no action;