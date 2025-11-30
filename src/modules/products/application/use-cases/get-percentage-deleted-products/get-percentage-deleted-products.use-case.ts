import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from "@modules/products/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetPercentageDeletedProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryInterface,
  ) { }

  async execute() {
    const percentage = await this.productRepository.getPercentageDeletedProducts();
    return {
      percentageDeletedProducts: percentage,
    }
  }
}

