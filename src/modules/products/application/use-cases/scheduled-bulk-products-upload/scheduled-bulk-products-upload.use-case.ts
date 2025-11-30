import { EnvironmentService } from "@config/environment";
import { PRODUCT_REPOSITORY, ProductRepositoryInterface } from "@modules/products/domain/repositories";
import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

export class ScheduledBulkUploadUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepositoryInterface,
    private readonly environmentService: EnvironmentService,
  ) { }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async execute() {
    const apiUrl = this.environmentService.externalApis.contentful;
    const products = await this.productRepository.getProductsByApiUrl(apiUrl);
    console.log('ScheduledBulkUploadUseCase executed. Products fetched:', products);

    await this.productRepository.bulkInsert(products);
  }
}
