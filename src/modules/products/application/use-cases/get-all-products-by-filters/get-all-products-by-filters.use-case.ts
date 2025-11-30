import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from "@modules/products/domain/repositories";
import { ProductsFiltersDto } from "@modules/products/infrastructure/dto";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAllProductsByFiltersUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryInterface,
  ) { }

  async execute(productsFilters: ProductsFiltersDto) {
    console.log('GetAllProductsByFiltersUseCase executed with filters:', productsFilters);
    return this.productRepository.getProductsByFilters(productsFilters);
  }
}

