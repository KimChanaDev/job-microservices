CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"charge" numeric NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
