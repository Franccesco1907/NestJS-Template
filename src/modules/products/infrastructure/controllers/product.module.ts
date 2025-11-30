import { GetAllProductsByFiltersUseCase, GetPercentageDeletedProductsUseCase, GetPercentageNonDeletedProductsByFiltersUseCase, RemoveProductUseCase, ScheduledBulkUploadUseCase } from '@modules/products/application';
import { ProductEntity } from '@modules/products/domain/entities';
import { PRODUCT_REPOSITORY } from '@modules/products/domain/repositories';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from '../repositories';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
    GetAllProductsByFiltersUseCase,
    ScheduledBulkUploadUseCase,
    GetPercentageDeletedProductsUseCase,
    GetPercentageNonDeletedProductsByFiltersUseCase,
    RemoveProductUseCase,
  ],
  exports: [],
})
export class ProductModule { }

