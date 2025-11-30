import { RemoveProductUseCase } from '@modules/products/application';
import { GetAllProductsByFiltersUseCase } from '@modules/products/application/use-cases/get-all-products-by-filters';
import { GetPercentageDeletedProductsUseCase } from '@modules/products/application/use-cases/get-percentage-deleted-products';
import { GetPercentageNonDeletedProductsByFiltersUseCase } from '@modules/products/application/use-cases/get-percentage-non-deleted-products-by-filters';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { NonDeletedProductsFiltersDto, ProductsFiltersDto } from '../dto';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guards';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getAllProductsByFiltersUseCase: GetAllProductsByFiltersUseCase,
    private readonly getPercentageDeletedProductsUseCase: GetPercentageDeletedProductsUseCase,
    private readonly getPercentageNonDeletedProductsByFiltersUseCase: GetPercentageNonDeletedProductsByFiltersUseCase,
    private readonly removeProductUseCase: RemoveProductUseCase,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProductByFilters(@Query() productsFilters: ProductsFiltersDto) {
    console.log('ProductsFiltersDto', productsFilters);
    return this.getAllProductsByFiltersUseCase.execute(productsFilters);
  }

  @Get('report/deleted-percentage')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getReportPercentageDeletedProducts() {
    return this.getPercentageDeletedProductsUseCase.execute();
  }

  @Get('report/non-deleted-percentage')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getReportPercentageNonDeletedProducts(@Query() nonDeletedProductsFilters: NonDeletedProductsFiltersDto) {
    return this.getPercentageNonDeletedProductsByFiltersUseCase.execute(nonDeletedProductsFilters);
  }

  @Delete(':sku')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async removeProduct(@Param('sku') sku: string) {
    return this.removeProductUseCase.execute(sku);
  }
}