import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, Max } from "class-validator";

const MAX_LIMIT = 5;

export class ProductsFiltersDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  priceMax?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Max(MAX_LIMIT)
  @Transform(({ value }) => Number(value))
  limit: number = MAX_LIMIT;
}