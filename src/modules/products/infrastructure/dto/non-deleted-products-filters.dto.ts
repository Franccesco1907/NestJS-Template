import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsOptional } from "class-validator";

export class NonDeletedProductsFiltersDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  hasPrice: boolean;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dateFrom: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dateTo: Date;
}