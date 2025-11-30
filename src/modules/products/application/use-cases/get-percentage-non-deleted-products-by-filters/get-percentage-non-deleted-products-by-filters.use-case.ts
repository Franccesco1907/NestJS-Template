import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from "@modules/products/domain/repositories";
import { NonDeletedProductsFiltersDto } from "@modules/products/infrastructure/dto";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetPercentageNonDeletedProductsByFiltersUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryInterface,
  ) { }

  async execute(nonDeletedProductsFilters: NonDeletedProductsFiltersDto) {
    const totalProducts = await this.productRepository.getPercentageNonDeletedProductsByFilters(nonDeletedProductsFilters);
    return {
      percentageNonDeletedProducts: totalProducts,
    };
  }
}