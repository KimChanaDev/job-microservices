import { Module } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { ProductsController } from "../controllers/products.controller";
import { CategoriesModule } from "./categories.module";

@Module({
    imports: [CategoriesModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }