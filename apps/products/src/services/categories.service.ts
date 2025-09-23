import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION } from "../consts/database-connection.const";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as categoriesSchema from "../schemas/categories.schema";


@Injectable()
export class CategoriesService {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof categoriesSchema>) { }

    async getCategoryByName(name: string): Promise<typeof categoriesSchema.categories.$inferSelect | undefined> {
        return this.db.query.categories.findFirst({
            where: eq(categoriesSchema.categories.name, name),
        });
    }
}