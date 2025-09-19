import { CreateProductRequest, CreateProductResponse, ProductsServiceController, ProductsServiceControllerMethods } from "@app/grpc";
import { Controller } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { Observable } from "rxjs";

@Controller()
@ProductsServiceControllerMethods()
export class ProductsController implements ProductsServiceController {

    constructor(private readonly productsService: ProductsService) { }

    createProduct(request: CreateProductRequest): Promise<CreateProductResponse> | Observable<CreateProductResponse> | CreateProductResponse {
        return this.productsService.createProduct(request);
    }
}