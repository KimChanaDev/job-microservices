import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/schemas/**/*.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.PRODUCTS_DATABASE_URL!,
    },
    migrations: {
        prefix: 'timestamp', // use timestamp as prefix
        table: '__drizzle_migrations',
        schema: 'public',
    },
    verbose: true, // show detailed information during generate/migrate
    strict: true,  // enable strict type checking
});
