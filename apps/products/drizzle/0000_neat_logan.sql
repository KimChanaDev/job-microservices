CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(255) NOT NULL,
	"price" real NOT NULL,
	"stock" integer NOT NULL,
	"rating" real NOT NULL,
	"description" text NOT NULL
);
