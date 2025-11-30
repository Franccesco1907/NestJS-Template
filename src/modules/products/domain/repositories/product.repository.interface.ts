import { OrmBaseRepository } from "@database/orm/repositories";
import { NonDeletedProductsFiltersDto, ProductsFiltersDto } from "@modules/products/infrastructure/dto";
import { ProductEntity } from "../entities";

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface PaginatedProducts {
  products: ProductEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductRepositoryInterface extends OrmBaseRepository<ProductEntity> {
  findBySku(sku: string): Promise<ProductEntity | null>;
  getProductsByFilters(filters: ProductsFiltersDto): Promise<PaginatedProducts>;
  getProductsByApiUrl(apiUrl: string): Promise<ProductEntity[]>;
  // clear(): Promise<void>;
  bulkInsert(products: ProductEntity[]): Promise<void>;
  getPercentageDeletedProducts(): Promise<number>;
  getPercentageNonDeletedProductsByFilters(filters: NonDeletedProductsFiltersDto): Promise<number>;
  remove(sku: string): Promise<ProductEntity | null>;
}
