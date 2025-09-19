import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION } from "../consts/database-connection.const";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../schemas/schema";

@Injectable()
export class ProductsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
    ) { }


    // Omit<typeof schema.products.$inferInsert, 'id'>) = data exclude id
    async createProduct(data: Omit<typeof schema.products.$inferInsert, 'id'>): Promise<typeof schema.products.$inferSelect> {
        const [newProduct] = await this.db.insert(schema.products).values({
            ...data
        }).returning();
        return newProduct;
    }

}