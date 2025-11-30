import { OrmBaseRepository } from '@database/orm/repositories';
import { PaginatedProducts, ProductRepositoryInterface } from '@modules/products/domain/repositories/product.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOptionsWhere, IsNull, LessThanOrEqual, Like, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { ProductEntity } from '../../domain/entities/product.entity';
import { NonDeletedProductsFiltersDto, ProductsFiltersDto } from '../dto';

@Injectable()
export class ProductRepository
  extends OrmBaseRepository<ProductEntity>
  implements ProductRepositoryInterface {
  constructor(
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    private dataSource: DataSource,
  ) {
    super(productRepository.target, dataSource);
  }

  async findBySku(sku: string): Promise<ProductEntity | null> {
    return this.productRepository.findOne({ where: { sku } });
  }

  async getProductsByApiUrl(apiUrl: string): Promise<ProductEntity[]> {
    let products: ProductEntity[] = [];

    await fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        products = data?.items.map(product => {
          return {
            sku: product.fields.sku,
            name: product.fields.name,
            brand: product.fields.brand,
            model: product.fields.model,
            category: product.fields.category,
            price: product.fields.price,
            currency: product.fields.currency,
            stock: product.fields.stock,
          };
        });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    return products;
  }

  async getProductsByFilters(filters: ProductsFiltersDto): Promise<PaginatedProducts> {
    const { name, category, priceMin, priceMax, page, limit } = filters;
    const where: FindOptionsWhere<ProductEntity> = {};

    if (name) where.name = Like(`%${name}%`);
    if (category) where.category = Like(`%${category}%`);
    if (priceMin !== undefined && priceMax !== undefined) {
      where.price = Between(priceMin, priceMax);
    } else if (priceMin !== undefined) {
      where.price = MoreThanOrEqual(priceMin);
    } else if (priceMax !== undefined) {
      where.price = LessThanOrEqual(priceMax);
    }
    where.deletedAt = IsNull();

    const [products, total] = await this.productRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log(`Total products: ${total}`);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // async clear(): Promise<void> {
  //   await this.productRepository.clear();
  // }

  async bulkInsert(products: ProductEntity[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const product of products) {
        const existingProduct = await queryRunner.manager.findOne(ProductEntity, {
          where: { sku: product.sku },
        });
        if (!existingProduct) {
          await queryRunner.manager.save(ProductEntity, product);
          console.log(`Inserted product with SKU: ${product.sku}`);
        } else {
          console.log(`Product with SKU: ${product.sku} already exists. Skipping insertion.`);
        }
      }
      await queryRunner.commitTransaction();
      console.log('Bulk insert transaction committed.');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error during bulk insert. Transaction rolled back.', error);
    } finally {
      await queryRunner.release();
    }
  }

  async getPercentageDeletedProducts(): Promise<number> {
    const totalProducts = await this.productRepository.count();
    const deletedProducts = await this.productRepository.count({
      where: { deletedAt: Not(IsNull()) },
    });

    if (totalProducts === 0) return 0;

    return (deletedProducts / totalProducts) * 100;
  }

  async getPercentageNonDeletedProductsByFilters(filters: NonDeletedProductsFiltersDto): Promise<number> {
    const totalProducts = await this.productRepository.count();

    let where: FindOptionsWhere<ProductEntity> = { deletedAt: IsNull() };
    if (filters.hasPrice) {
      where.price = Not(IsNull());
    }

    if (filters.dateFrom && filters.dateTo) {
      where = {
        ...where,
        createdAt: Between(new Date(filters.dateFrom), new Date(filters.dateTo)),
      };
    } else if (filters.dateFrom) {
      where = {
        ...where,
        createdAt: MoreThanOrEqual(new Date(filters.dateFrom)),
      };
    } else if (filters.dateTo) {
      where = {
        ...where,
        createdAt: LessThanOrEqual(new Date(filters.dateTo)),
      };
    }

    const nonDeletedProducts = await this.productRepository.count({ where });

    if (totalProducts === 0) return 0;

    return (nonDeletedProducts / totalProducts) * 100;
  }

  async remove(sku: string): Promise<ProductEntity | null> {
    const product = await this.productRepository.findOne({ where: { sku } });
    if (!product) {
      return null;
    }
    product.deletedAt = new Date();
    await this.productRepository.save(product);
    return product;
  }
}