import { Global, Module } from "@nestjs/common";
import { DATABASE_CONNECTION } from "../consts/database-connection.const";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as productsSchema from "../schemas/schema";

@Global()
@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: async (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.get<string>('PRODUCTS_DATABASE_URL'),
                });
                return drizzle(pool, {
                    schema: {
                        ...productsSchema
                    }
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule { }