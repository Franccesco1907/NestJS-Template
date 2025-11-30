import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from "@modules/products/domain/repositories";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RemoveProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryInterface,
  ) { }

  async execute(sku: string) {
    const removedProduct = await this.productRepository.remove(sku);
    return removedProduct;
  }
}