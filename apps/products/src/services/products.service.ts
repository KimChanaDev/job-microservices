import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION } from "../consts/database-connection.const";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../schemas/products.schema";
import { CategoriesService } from "./categories.service";

@Injectable()
export class ProductsService {
    constructor(
        @Inject(DATABASE_CONNECTION) private db: NodePgDatabase<typeof schema>,
        private categoriesService: CategoriesService
    ) { }


    // Omit<typeof schema.products.$inferInsert, 'id'>) = data exclude id
    async createProduct(data: Omit<typeof schema.products.$inferInsert, 'id'>): Promise<typeof schema.products.$inferSelect> {
        const category = await this.categoriesService.getCategoryByName(data.category);
        const [newProduct] = await this.db.insert(schema.products).values({
            ...data,
            price: category ? (Number(data.price) + (Number(data.price) * Number(category.charge) / 100)).toString() : data.price,
        }).returning();
        return newProduct;
    }

}