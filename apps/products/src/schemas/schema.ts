import { text, integer, serial, pgTable, varchar, real } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    price: real('price').notNull(),
    stock: integer('stock').notNull(),
    rating: real('rating').notNull(),
    description: text('description').notNull(),
});
